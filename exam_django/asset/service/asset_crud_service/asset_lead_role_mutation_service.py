from asset.service.asset_crud_service.asset_user_role_mutation_abstract import (
    AssetUserRoleMutationAbstract,
)
from messages import ASSET_SUCCESSFULLY_CREATED


class AssetLeadRoleMutationService(AssetUserRoleMutationAbstract):

    def create_asset(self, serializer, request):
        serializer.validated_data["approved_by"] = request.user
        serializer.validated_data["asset_detail_status"] = "CREATED"
        message = ASSET_SUCCESSFULLY_CREATED
        email_subject = "ASSET CREATION SUCCESSFUL"
        return serializer, message, email_subject
