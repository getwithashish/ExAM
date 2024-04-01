from rest_framework import status
from asset.service.asset_crud_service.asset_user_role_mutation_abstract import (
    AssetUserRoleMutationAbstract,
)
from asset.serializers.asset_serializer import AssetWriteSerializer
from exceptions import NotAcceptableOperationException
from messages import (
    ASSET_SUCCESSFULLY_CREATED,
    ASSET_SUCCESSFULLY_UPDATED,
    ASSET_UPDATION_UNSUCCESSFUL,
)
from utils.TableUtil import TableUtil


class AssetLeadRoleMutationService(AssetUserRoleMutationAbstract):

    def create_asset(self, serializer, request):
        serializer.validated_data["approved_by"] = request.user
        serializer.validated_data["asset_detail_status"] = "CREATED"
        message = ASSET_SUCCESSFULLY_CREATED
        email_subject = "ASSET CREATION SUCCESSFUL"
        return serializer, message, email_subject

    def update_asset(self, serializer, asset, request):
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
                serializer.validated_data["version"] = original_data.get("version") + 1

        elif asset.asset_detail_status in ["CREATE_PENDING", "UPDATE_PENDING"]:
            raise NotAcceptableOperationException(
                {}, ASSET_UPDATION_UNSUCCESSFUL, status.HTTP_406_NOT_ACCEPTABLE
            )

        # Renamed conceder to approved_by in Asset Model. Still, this somehow works. So, not changing
        serializer.validated_data["conceder"] = request.user

        return serializer, message, email_subject
