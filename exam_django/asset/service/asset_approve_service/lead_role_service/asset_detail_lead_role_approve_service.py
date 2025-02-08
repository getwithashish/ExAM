from rest_framework import status
from typing import Tuple, Any

from asset.service.asset_approve_service.asset_user_role_approve_abstract import (
    AssetUserRoleApproveAbstract,
)
from exceptions import NotAcceptableOperationException
from messages import (
    ASSET_CREATION_REJECTED,
    ASSET_SUCCESSFULLY_CREATED,
    ASSET_SUCCESSFULLY_UPDATED,
    ASSET_UPDATION_REJECTED,
    CANNOT_APPROVE_ACKNOWLEDGED_ASSET,
    CANNOT_REJECT_ACKNOWLEDGED_ASSET,
)


class AssetDetailLeadRoleApproveService(AssetUserRoleApproveAbstract):
    """Service class for lead to manage approval/rejection of asset creation/update requests"""

    def approve_request(self, asset: Any, request: Any) -> Tuple[Any, str, str]:
        """
        Approve an asset request based on its current status.

        Args:
            asset: The asset object to be approved.
            request: The request object containing the context.

        Returns:
            A tuple containing the updated asset, a message string, and an email subject string.

        Raises:
            NotAcceptableOperationException: If the asset status is not suitable for approval.
        """
        if asset.asset_detail_status == "CREATE_PENDING":
            asset.asset_detail_status = "CREATED"
            message = ASSET_SUCCESSFULLY_CREATED
            email_subject = "APPROVED: ASSET CREATION SUCCESSFUL"

        elif asset.asset_detail_status == "UPDATE_PENDING":
            asset.asset_detail_status = "UPDATED"
            message = ASSET_SUCCESSFULLY_UPDATED
            email_subject = "APPROVED: ASSET UPDATION SUCCESSFUL"

        else:
            raise NotAcceptableOperationException(
                {}, CANNOT_APPROVE_ACKNOWLEDGED_ASSET, status.HTTP_400_BAD_REQUEST
            )

        if asset.status == "SCRAP":
            asset.is_deleted = True

        return asset, message, email_subject

    def reject_request(self, asset: Any, request: Any) -> Tuple[Any, str, str]:
        """
        Reject an asset request based on its current status.

        Args:
            asset: The asset object to be rejected.
            request: The request object containing the context.

        Returns:
            A tuple containing the updated asset, a message string, and an email subject string.

        Raises:
            NotAcceptableOperationException: If the asset status is not suitable for rejection.
        """
        if asset.asset_detail_status == "CREATE_PENDING":
            asset.asset_detail_status = "CREATE_REJECTED"
            message = ASSET_CREATION_REJECTED
            email_subject = "REJECTED: ASSET CREATION REJECTED"

        elif asset.asset_detail_status == "UPDATE_PENDING":
            asset.asset_detail_status = "UPDATE_REJECTED"
            message = ASSET_UPDATION_REJECTED
            email_subject = "REJECTED: ASSET UPDATION REJECTED"

        else:
            raise NotAcceptableOperationException(
                {}, CANNOT_REJECT_ACKNOWLEDGED_ASSET, status.HTTP_400_BAD_REQUEST
            )

        return asset, message, email_subject
