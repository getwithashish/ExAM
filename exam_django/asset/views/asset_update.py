from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from asset.serializers.AssetSerializer import AssetWriteSerializer
from asset.models import Asset
from utils.TableUtil import TableUtil
from messages import (
    ASSET_CREATE_PENDING_SUCCESSFUL,
    ASSET_NOT_FOUND,
    ASSET_SUCCESSFULLY_CREATED,
    ASSET_SUCCESSFULLY_UPDATED,
    ASSET_UPDATE_PENDING_SUCCESSFUL,
    ASSET_UPDATION_UNSUCCESSFUL,
    USER_UNAUTHORIZED,
)
from response import APIResponse

from notification.service.EmailService import EmailService
from rest_framework.renderers import JSONRenderer


class AssetUpdateView(APIView):

    def get_permissions(self):
        if self.request.method == "PATCH":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def patch(self, request):
        email_service = EmailService()
        try:
            user_scope = request.user.user_scope
            asset_uuid = request.data.get("asset_uuid")
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return APIResponse(
                data={},
                message=ASSET_NOT_FOUND,
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AssetWriteSerializer(
            asset, data=request.data.get("data"), partial=True
        )

        if serializer.is_valid():

            if user_scope == "SYSTEM_ADMIN":
                if asset.asset_detail_status == "CREATE_REJECTED":
                    serializer.validated_data["asset_detail_status"] = "CREATE_PENDING"
                    message = ASSET_CREATE_PENDING_SUCCESSFUL
                    email_subject = "ASSET CREATION REQUEST SENT"

                elif asset.asset_detail_status in [
                    "UPDATE_REJECTED",
                    "UPDATED",
                    "CREATED",
                ]:
                    serializer.validated_data["asset_detail_status"] = "UPDATE_PENDING"
                    message = ASSET_UPDATE_PENDING_SUCCESSFUL
                    email_subject = "ASSET UPDATION REQUEST SENT"

                elif asset.asset_detail_status in ["CREATE_PENDING", "UPDATE_PENDING"]:
                    return APIResponse(
                        data={},
                        message=ASSET_UPDATION_UNSUCCESSFUL,
                        status=status.HTTP_406_NOT_ACCEPTABLE,
                    )

            elif user_scope == "LEAD":
                if asset.asset_detail_status == "CREATE_REJECTED":
                    serializer.validated_data["asset_detail_status"] = "CREATED"
                    message = ASSET_SUCCESSFULLY_CREATED
                    email_subject = "ASSET CREATION SUCCESSFUL"

                elif asset.asset_detail_status in [
                    "UPDATE_REJECTED",
                    "UPDATED",
                    "CREATED",
                ]:
                    serializer.validated_data["asset_detail_status"] = "UPDATED"
                    message = ASSET_SUCCESSFULLY_UPDATED
                    email_subject = "ASSET UPDATION SUCCESSFUL"

                    # TODO How about doing this operation in trigger
                    # Increment version of asset if there is a change in values of the defined fields
                    original_data = AssetWriteSerializer(asset).data
                    changed_fields = TableUtil.get_changed_fields(
                        original_data, serializer.validated_data
                    )

                    fields_affecting_version = {
                        "os",
                        "os_version",
                        "mobile_os",
                        "processor",
                        "processor_gen",
                        "memory",
                        "storage",
                        "configuration",
                        "accessories",
                    }
                    has_fields_affecting_version = TableUtil.has_expected_keys(
                        changed_fields, fields_affecting_version
                    )
                    if has_fields_affecting_version:
                        serializer.validated_data["version"] = (
                            original_data.get("version") + 1
                        )

                elif asset.asset_detail_status in ["CREATE_PENDING", "UPDATE_PENDING"]:
                    return APIResponse(
                        data={},
                        message=ASSET_UPDATION_UNSUCCESSFUL,
                        status=status.HTTP_406_NOT_ACCEPTABLE,
                    )

                # Renamed conceder to approved_by in Asset Model. Still, this somehow works. So, not changing
                serializer.validated_data["conceder"] = request.user

            else:
                return APIResponse(
                    data={},
                    message=USER_UNAUTHORIZED,
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            serializer.validated_data["requester"] = request.user
            serializer.save()

            json_string = JSONRenderer().render(serializer.data).decode("utf-8")
            email_service.send_email(
                email_subject,
                "Serializer Data: {}".format(json_string),
                [
                    "astg7542@gmail.com",
                    "acj88178@gmail.com",
                    "asimapalexperion23@gmail.com",
                    "aidrin.varghese@experionglobal.com",
                    "pavithraexperion@gmail.com",
                ],
            )

            return APIResponse(
                data=serializer.data,
                message=message,
                status=status.HTTP_201_CREATED,
            )

        return APIResponse(
            data=serializer.errors,
            message=ASSET_UPDATION_UNSUCCESSFUL,
            status=status.HTTP_400_BAD_REQUEST,
        )
