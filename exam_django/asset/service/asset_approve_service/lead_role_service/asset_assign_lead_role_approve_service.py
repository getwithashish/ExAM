from typing import Any
from asset.models.asset import Asset
from rest_framework import status

from asset.service.asset_approve_service.asset_user_role_approve_abstract import (
    AssetUserRoleApproveAbstract,
)
from exceptions import NotAcceptableOperationException
from messages import (
    ASSET_SUCCESSFULLY_ASSIGNED,
    ASSET_SUCCESSFULLY_UNASSIGNED,
    ASSIGN_ASSET_REJECT_SUCCESSFUL,
    CANNOT_APPROVE_ACKNOWLEDGED_ASSET,
    CANNOT_ASSIGN_UNAPPROVED_ASSET,
    CANNOT_REJECT_ACKNOWLEDGED_ASSET,
    CANNOT_UNASSIGN_UNAPPROVED_ASSET,
    UNASSIGN_ASSET_REJECT_SUCCESSFUL,
)


class AssetAssignLeadRoleApproveService(AssetUserRoleApproveAbstract):
    """
    Service class for lead to approve/reject asset assignment/unassignment requests.
    """

    def approve_request(self, asset: Asset, request: Any) -> tuple[Asset, str, str]:
        """
        Approves the asset assignment or unassignment request based on the asset's detail status and assignment status.

        Args:
            asset (Asset): The asset instance to be approved or unassigned.
            request (Any): The request object that contains details of the request.

        Returns:
            tuple[Asset, str, str]: A tuple containing the updated asset instance, the success message, and the email subject.

        Raises:
            NotAcceptableOperationException: If the asset status is not appropriate for assignment or unassignment.
        """
        if asset.asset_detail_status in ["CREATED", "UPDATED"]:
            if asset.assign_status == "ASSIGN_PENDING":
                if asset.custodian:
                    asset.assign_status = "ASSIGNED"
                    asset.status = "USE"
                    message = ASSET_SUCCESSFULLY_ASSIGNED
                    email_subject = "APPROVED: ASSET ALLOCATION SUCCESSFUL"

                else:
                    asset.assign_status = "UNASSIGNED"
                    if asset.status == "USE":
                        asset.status = "STOCK"
                    asset.business_unit = None
                    message = ASSET_SUCCESSFULLY_UNASSIGNED
                    email_subject = "APPROVED: ASSET DEALLOCATION SUCCESSFUL"

            else:
                raise NotAcceptableOperationException(
                    {}, CANNOT_APPROVE_ACKNOWLEDGED_ASSET, status.HTTP_400_BAD_REQUEST
                )

            return asset, message, email_subject

        else:
            if asset.custodian:
                message = CANNOT_ASSIGN_UNAPPROVED_ASSET
            else:
                message = CANNOT_UNASSIGN_UNAPPROVED_ASSET
            raise NotAcceptableOperationException(
                {}, message, status.HTTP_400_BAD_REQUEST
            )

    def reject_request(self, asset, request) -> tuple[Asset, str, str]:
        """
        Rejects the asset assignment or unassignment request.

        Args:
            asset (Asset): The asset instance to be approved or unassigned.
            request (Any): The request object that contains details of the request.

        Returns:
            tuple[Asset, str, str]: A tuple containing the updated asset instance, the success message, and the email subject.

        Raises:
            NotAcceptableOperationException: If the asset status is not appropriate for rejection.
        """
        if asset.assign_status == "ASSIGN_PENDING":
            asset.assign_status = "REJECTED"
            if asset.custodian:
                message = ASSIGN_ASSET_REJECT_SUCCESSFUL
                email_subject = "REJECTED: ASSET ALLOCATION REJECTED"
            else:
                message = UNASSIGN_ASSET_REJECT_SUCCESSFUL
                email_subject = "REJECTED: ASSET DEALLOCATION REJECTED"

        else:
            raise NotAcceptableOperationException(
                {}, CANNOT_REJECT_ACKNOWLEDGED_ASSET, status.HTTP_400_BAD_REQUEST
            )

        return asset, message, email_subject
