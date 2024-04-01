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
)


class AssetAssignLeadRoleApproveService(AssetUserRoleApproveAbstract):

    def approve_request(self, asset, request):
        if asset.asset_detail_status in ["CREATED", "UPDATED"]:
            if asset.assign_status == "ASSIGN_PENDING":
                if asset.custodian:
                    asset.assign_status = "ASSIGNED"
                    asset.status = "IN USE"
                    message = ASSET_SUCCESSFULLY_ASSIGNED
                    email_subject = "ASSET ASSIGNMENT SUCCESSFUL"

                else:
                    print("UNASSIGNED HERE")
                    asset.assign_status = "UNASSIGNED"
                    asset.status = "IN STORE"
                    message = ASSET_SUCCESSFULLY_UNASSIGNED
                    email_subject = "ASSET UNASSIGNMENT SUCCESSFUL"

            else:
                raise NotAcceptableOperationException(
                    {}, CANNOT_APPROVE_ACKNOWLEDGED_ASSET, status.HTTP_400_BAD_REQUEST
                )

            return asset, message, email_subject

        else:
            raise NotAcceptableOperationException(
                {}, CANNOT_ASSIGN_UNAPPROVED_ASSET, status.HTTP_400_BAD_REQUEST
            )

    def reject_request(self, asset, request):
        if asset.assign_status == "ASSIGN_PENDING":
            asset.assign_status = "REJECTED"
            message = ASSIGN_ASSET_REJECT_SUCCESSFUL
            email_subject = "REJECTED THE REQUEST FOR ASSIGNING/UNASSIGNING AN ASSET"

        else:
            raise NotAcceptableOperationException(
                {}, CANNOT_REJECT_ACKNOWLEDGED_ASSET, status.HTTP_400_BAD_REQUEST
            )

        return asset, message, email_subject
