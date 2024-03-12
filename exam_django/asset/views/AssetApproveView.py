from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from asset.models import Asset
from asset.serializers.AssetSerializer import AssetReadSerializer
from messages import (
    APPROVAL_TYPE_NOT_FOUND,
    ASSET_NOT_FOUND,
    ASSET_SUCCESSFULLY_ASSIGNED,
    ASSET_SUCCESSFULLY_CREATED,
    ASSET_SUCCESSFULLY_UNASSIGNED,
    ASSET_SUCCESSFULLY_UPDATED,
    CANNOT_APPROVE_ACKNOWLEDGED_ASSET,
    CANNOT_ASSIGN_UNAPPROVED_ASSET,
    USER_UNAUTHORIZED,
)
from response import APIResponse


class AssetApproveView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request):
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

                elif asset.asset_detail_status == "UPDATE_PENDING":
                    asset.asset_detail_status = "UPDATED"
                    message = ASSET_SUCCESSFULLY_UPDATED

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
                            asset.assign_status == "UNASSIGNED"
                            asset.status = "IN STORE"
                            message = ASSET_SUCCESSFULLY_UNASSIGNED

                        else:
                            asset.assign_status == "ASSIGNED"
                            asset.status = "IN USE"
                            message = ASSET_SUCCESSFULLY_ASSIGNED

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
