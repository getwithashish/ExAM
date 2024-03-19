from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from asset.models import Asset
from asset.serializers.AssetSerializer import AssetReadSerializer, AssetWriteSerializer
from messages import (
    APPROVAL_TYPE_NOT_FOUND,
    ASSET_NOT_FOUND,
    ASSET_REJECTED_SUCCESSFUL,
    ASSET_SUCCESSFULLY_ASSIGNED,
    ASSET_SUCCESSFULLY_CREATED,
    ASSET_SUCCESSFULLY_UNASSIGNED,
    ASSET_SUCCESSFULLY_UPDATED,
    ASSIGN_ASSET_REJECT_SUCCESSFUL,
    CANNOT_APPROVE_ACKNOWLEDGED_ASSET,
    CANNOT_ASSIGN_UNAPPROVED_ASSET,
    CANNOT_REJECT_ACKNOWLEDGED_ASSET,
    CANNOT_UNASSIGN_ASSET_NOT_IN_PENDING,
    USER_UNAUTHORIZED,
)
from response import APIResponse
from notification.service.EmailService import EmailService
from rest_framework.renderers import JSONRenderer


class AssetApproveView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        elif self.request.method == "DELETE":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request):
        email_service = EmailService()
        try:
            user_scope = request.user.user_scope
            approval_type = request.data.get("approval_type")
            asset_uuid = request.data.get("asset_uuid")
            comments = request.data.get("comments")
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return APIResponse(
                data={},
                message=ASSET_NOT_FOUND,
                status=status.HTTP_404_NOT_FOUND,
            )

        if user_scope == "LEAD":
            asset.approved_by = request.user
            asset.approval_status_message = comments

            if approval_type == "ASSET_DETAIL_STATUS":
                if asset.asset_detail_status == "CREATE_PENDING":
                    asset.asset_detail_status = "CREATED"
                    message = ASSET_SUCCESSFULLY_CREATED
                    email_subject = "ASSET CREATION SUCCESSFUL"

                elif asset.asset_detail_status == "UPDATE_PENDING":
                    asset.asset_detail_status = "UPDATED"
                    message = ASSET_SUCCESSFULLY_UPDATED
                    email_subject = "ASSET UPDATION SUCCESSFUL"

                    # TODO How to increment version here since the changed values are already saved in the database

                else:
                    return APIResponse(
                        data={},
                        message=CANNOT_APPROVE_ACKNOWLEDGED_ASSET,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            elif approval_type == "ASSIGN_STATUS":
                if asset.asset_detail_status in ["CREATED", "UPDATED"]:
                    if asset.assign_status == "ASSIGN_PENDING":
                        if asset.custodian:
                            asset.assign_status = "ASSIGNED"
                            asset.status = "IN USE"
                            message = ASSET_SUCCESSFULLY_ASSIGNED
                            email_subject = "ASSET ASSIGNMENT SUCCESSFUL"

                        else:
                            print("UNASSIGNED HERE")
                            asset.assign_status = "UNASSIGNED"
                            asset.status = "IN STORE"
                            message = ASSET_SUCCESSFULLY_UNASSIGNED
                            email_subject = "ASSET UNASSIGNMENT SUCCESSFUL"

                    else:
                        return APIResponse(
                            data={},
                            message=CANNOT_APPROVE_ACKNOWLEDGED_ASSET,
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                else:
                    return APIResponse(
                        data={},
                        message=CANNOT_ASSIGN_UNAPPROVED_ASSET,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            else:
                return APIResponse(
                    data={},
                    message=APPROVAL_TYPE_NOT_FOUND,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            asset.save()
            serializer = AssetReadSerializer(asset)
            json_string = JSONRenderer().render(serializer.data).decode("utf-8")
            email_service.send_email(
                email_subject,
                "Serializer Data: {}".format(json_string),
                ["astg7542@gmail.com"],
            )
            print(serializer.data)
            return APIResponse(
                data=serializer.data,
                message=message,
                status=status.HTTP_202_ACCEPTED,
            )

        else:
            return APIResponse(
                data={},
                message=USER_UNAUTHORIZED,
                status=status.HTTP_401_UNAUTHORIZED,
            )

    def delete(self, request):
        try:
            user_scope = request.user.user_scope
            approval_type = request.data.get("approval_type")
            asset_uuid = request.data.get("asset_uuid")
            comments = request.data.get("comments")
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return APIResponse(
                data={},
                message=ASSET_NOT_FOUND,
                status=status.HTTP_404_NOT_FOUND,
            )

        if user_scope == "LEAD":
            asset.approved_by = request.user
            asset.approval_status_message = comments

            if approval_type == "ASSET_DETAIL_STATUS":
                if asset.asset_detail_status == "CREATE_PENDING":
                    asset.asset_detail_status = "CREATE_REJECTED"
                    message = ASSET_REJECTED_SUCCESSFUL

                elif asset.asset_detail_status == "UPDATE_PENDING":
                    asset.asset_detail_status = "UPDATE_REJECTED"
                    message = ASSET_REJECTED_SUCCESSFUL

                    # TODO How to increment version here since the changed values are already saved in the database

                else:
                    return APIResponse(
                        data={},
                        message=CANNOT_REJECT_ACKNOWLEDGED_ASSET,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            elif approval_type == "ASSIGN_STATUS":
                if asset.assign_status == "ASSIGN_PENDING":
                    asset.assign_status = "REJECTED"
                    message = ASSIGN_ASSET_REJECT_SUCCESSFUL

                else:
                    return APIResponse(
                        data={},
                        message=CANNOT_UNASSIGN_ASSET_NOT_IN_PENDING,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            else:
                return APIResponse(
                    data={},
                    message=APPROVAL_TYPE_NOT_FOUND,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            asset.save()
            serializer = AssetReadSerializer(asset)
            print(serializer.data)
            return APIResponse(
                data=serializer.data,
                message=message,
                status=status.HTTP_202_ACCEPTED,
            )
