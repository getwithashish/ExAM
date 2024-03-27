from response import APIResponse
from asset.service.asset_assign_crud_service.asset_sysadmin_role_assignasset_service import (
    AssetSysadminRoleAssignService,
)
from asset.service.asset_assign_crud_service.asset_lead_role_assignasset_service import (
    AssetLeadRoleAssignService,
)
from rest_framework import status
from messages import UNAUTHORIZED_NO_PERMISSION, EMPLOYEE_NOT_FOUND_ERROR
from asset.models import Employee


class AssignAssetService:
    @staticmethod
    def assign_asset(requester_role, asset, employee_id, requester):
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return APIResponse(
                message=EMPLOYEE_NOT_FOUND_ERROR,
                status=status.HTTP_404_NOT_FOUND,
            )
        if requester_role == "SYSTEM_ADMIN":
            return AssetSysadminRoleAssignService.assign_asset(
                asset, employee, requester
            )
        elif requester_role == "LEAD":
            return AssetLeadRoleAssignService.assign_asset(asset, employee, requester)
        else:
            # Only return error message and status code for unauthorized roles
            return {
                "message": UNAUTHORIZED_NO_PERMISSION,
                "status": status.HTTP_403_FORBIDDEN,
            }
