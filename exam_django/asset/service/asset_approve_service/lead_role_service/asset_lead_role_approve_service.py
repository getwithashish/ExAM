from rest_framework import status

from asset.service.asset_approve_service.asset_user_role_approve_abstract import (
    AssetUserRoleApproveAbstract,
)
from asset.service.asset_approve_service.lead_role_service.asset_detail_lead_role_approve_service import (
    AssetDetailLeadRoleApproveService,
)
from asset.service.asset_approve_service.lead_role_service.asset_assign_lead_role_approve_service import (
    AssetAssignLeadRoleApproveService,
)
from messages import APPROVAL_TYPE_NOT_FOUND
from exceptions import NotFoundException


class AssetLeadRoleApproveService(AssetUserRoleApproveAbstract):

    def approve_request(self, asset, request):
        approval_type = request.data.get("approval_type")
        if approval_type == "ASSET_DETAIL_STATUS":
            asset_operation_approve_service = AssetDetailLeadRoleApproveService()
        elif approval_type == "ASSIGN_STATUS":
            asset_operation_approve_service = AssetAssignLeadRoleApproveService()
        else:
            raise NotFoundException(
                {}, APPROVAL_TYPE_NOT_FOUND, status.HTTP_400_BAD_REQUEST
            )

        asset, message, email_subject = asset_operation_approve_service.approve_request(
            asset, request
        )
        return asset, message, email_subject

    def reject_request(self, asset, request):
        approval_type = request.data.get("approval_type")
        if approval_type == "ASSET_DETAIL_STATUS":
            asset_operation_approve_service = AssetDetailLeadRoleApproveService()
        elif approval_type == "ASSIGN_STATUS":
            asset_operation_approve_service = AssetAssignLeadRoleApproveService()
        else:
            raise NotFoundException(
                {}, APPROVAL_TYPE_NOT_FOUND, status.HTTP_400_BAD_REQUEST
            )

        asset, message, email_subject = asset_operation_approve_service.reject_request(
            asset, request
        )
        return asset, message, email_subject
