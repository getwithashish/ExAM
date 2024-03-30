from rest_framework import status
from asset.service.asset_crud_service.asset_user_role_mutation_abstract import (
    AssetUserRoleMutationAbstract,
)
from exceptions import NotAcceptableOperation
from messages import (
    ASSET_CREATE_PENDING_SUCCESSFUL,
    ASSET_UPDATE_PENDING_SUCCESSFUL,
    ASSET_UPDATION_UNSUCCESSFUL,
)


class AssetSysadminRoleMutationService(AssetUserRoleMutationAbstract):

    def create_asset(self, serializer, request):
        serializer.validated_data["asset_detail_status"] = "CREATE_PENDING"
        message = ASSET_CREATE_PENDING_SUCCESSFUL
        email_subject = "ASSET CREATION REQUEST SENT"
        return serializer, message, email_subject

    def update_asset(self, serializer, asset, request):
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
            raise NotAcceptableOperation(
                {}, ASSET_UPDATION_UNSUCCESSFUL, status.HTTP_406_NOT_ACCEPTABLE
            )

        return serializer, message, email_subject
