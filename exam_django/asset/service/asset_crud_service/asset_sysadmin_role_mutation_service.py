from asset.service.asset_crud_service.asset_user_role_mutation_abstract import (
    AssetUserRoleMutationAbstract,
)
from messages import ASSET_CREATE_PENDING_SUCCESSFUL


class AssetSysadminRoleMutationService(AssetUserRoleMutationAbstract):

    def create_asset(self, serializer, request):
        serializer.validated_data["asset_detail_status"] = "CREATE_PENDING"
        message = ASSET_CREATE_PENDING_SUCCESSFUL
        email_subject = "ASSET CREATION REQUEST SENT"
        return serializer, message, email_subject
