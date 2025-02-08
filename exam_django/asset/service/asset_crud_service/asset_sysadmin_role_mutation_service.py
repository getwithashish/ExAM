from typing import Tuple
from rest_framework import status

from asset.models.asset import Asset
from asset.service.asset_crud_service.asset_user_role_mutation_abstract import (
    AssetUserRoleMutationAbstract,
)
from exceptions import NotAcceptableOperationException
from messages import (
    ASSET_CREATE_PENDING_SUCCESSFUL,
    ASSET_UPDATE_PENDING_SUCCESSFUL,
    ASSET_UPDATION_UNSUCCESSFUL,
)
from rest_framework.request import Request
from rest_framework.serializers import Serializer


class AssetSysadminRoleMutationService(AssetUserRoleMutationAbstract):
    """
    Service class for system admin to request asset creation/updation operations
    """

    def create_asset(self, serializer: Serializer, request: Request) -> Tuple[Serializer, str, str]:
        """
        Create a new asset with status 'CREATE_PENDING'.

        Args:
            serializer (Serializer): The serializer for the asset.
            request (Request): The HTTP request instance.

        Returns:
            tuple: A tuple containing the serializer, message, and email subject.
        """

        serializer.validated_data["asset_detail_status"] = "CREATE_PENDING"
        message = ASSET_CREATE_PENDING_SUCCESSFUL
        email_subject = "REQUEST: ASSET CREATION REQUEST"
        return serializer, message, email_subject

    def update_asset(self, serializer: Serializer, asset: Asset, request: Request) -> Tuple[Serializer, str, str]:
        """
        Update an existing asset's status based on its current state.

        Args:
            serializer (Serializer): The serializer for the asset.
            asset: The asset instance to be updated.
            request (Request): The HTTP request instance.

        Returns:
            tuple: A tuple containing the serializer, message, and email subject.
        """

        if asset.asset_detail_status == "CREATE_REJECTED":
            serializer.validated_data["asset_detail_status"] = "CREATE_PENDING"
            message = ASSET_CREATE_PENDING_SUCCESSFUL
            email_subject = "REQUEST: ASSET CREATION RE-REQUEST"

        elif asset.asset_detail_status in [
            "UPDATE_REJECTED",
            "UPDATED",
            "CREATED",
        ]:
            serializer.validated_data["asset_detail_status"] = "UPDATE_PENDING"
            message = ASSET_UPDATE_PENDING_SUCCESSFUL
            if asset.asset_detail_status == "UPDATE_REJECTED":
                email_subject = "REQUEST: ASSET UPDATION RE-REQUEST"
            else:
                email_subject = "REQUEST: ASSET UPDATION REQUEST"

        elif asset.asset_detail_status in ["CREATE_PENDING", "UPDATE_PENDING"]:
            raise NotAcceptableOperationException(
                {}, ASSET_UPDATION_UNSUCCESSFUL, status.HTTP_406_NOT_ACCEPTABLE
            )

        return serializer, message, email_subject
