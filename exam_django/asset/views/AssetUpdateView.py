from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from asset.serializers.AssetSerializer import AssetWriteSerializer
from asset.models import Asset
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


class AssetUpdateView(APIView):

    def get_permissions(self):
        if self.request.method == "PATCH":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def patch(self, request):
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

                elif asset.asset_detail_status in [
                    "UPDATE_REJECTED",
                    "UPDATED",
                    "CREATED",
                ]:
                    serializer.validated_data["asset_detail_status"] = "UPDATE_PENDING"
                    message = ASSET_UPDATE_PENDING_SUCCESSFUL

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

                elif asset.asset_detail_status in [
                    "UPDATE_REJECTED",
                    "UPDATED",
                    "CREATED",
                ]:
                    serializer.validated_data["asset_detail_status"] = "UPDATED"
                    message = ASSET_SUCCESSFULLY_UPDATED

                elif asset.asset_detail_status in ["CREATE_PENDING", "UPDATE_PENDING"]:
                    return APIResponse(
                        data={},
                        message=ASSET_UPDATION_UNSUCCESSFUL,
                        status=status.HTTP_406_NOT_ACCEPTABLE,
                    )

                serializer.validated_data["conceder"] = request.user

            else:
                return APIResponse(
                    data={},
                    message=USER_UNAUTHORIZED,
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            serializer.validated_data["requester"] = request.user
            serializer.save()
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
