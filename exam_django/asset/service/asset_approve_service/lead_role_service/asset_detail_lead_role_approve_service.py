from rest_framework import status

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

    def approve_request(self, asset, request):
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

        return asset, message, email_subject

    def reject_request(self, asset, request):
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
