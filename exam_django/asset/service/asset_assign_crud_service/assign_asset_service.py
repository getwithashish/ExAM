from response import APIResponse
from asset.service.asset_assign_crud_service.asset_sysadmin_role_assignasset_service import (
    AssetSysadminRoleAssignService,
)
from asset.service.asset_assign_crud_service.asset_lead_role_assignasset_service import (
    AssetLeadRoleAssignService,
)
from rest_framework import status
from messages import (
    UNAUTHORIZED_NO_PERMISSION,
    EMPLOYEE_NOT_FOUND_ERROR,
    STATUS_EXPIRED_OR_DISPOSED,
    ASSET_NOT_FOUND,
)
from asset.models import Employee
from notification.service.EmailService import EmailService
from rest_framework.renderers import JSONRenderer
from asset.serializers import AssignAssetSerializer
from asset.models import Asset


class AssignAssetService:
    @staticmethod
    def assign_asset(requester_role, asset_uuid, employee_id, requester):
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return APIResponse(
                message=EMPLOYEE_NOT_FOUND_ERROR,
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return APIResponse(
                message=ASSET_NOT_FOUND,
                status=status.HTTP_404_NOT_FOUND,
            )

        if asset.status in ["EXPIRED", "DISPOSED"]:
            return APIResponse(
                message=STATUS_EXPIRED_OR_DISPOSED,
                status=status.HTTP_400_BAD_REQUEST,
            )

        if requester_role == "SYSTEM_ADMIN":
            message = AssetSysadminRoleAssignService.assign_asset(
                asset, employee, requester
            )
        elif requester_role == "LEAD":
            message = AssetLeadRoleAssignService.assign_asset(
                asset, employee, requester
            )
        else:
            # Only return error message and status code for unauthorized roles
            return {
                "message": UNAUTHORIZED_NO_PERMISSION,
                "status": status.HTTP_403_FORBIDDEN,
            }

        # Send email
        email_service = EmailService()
        assigned_asset_serializer = AssignAssetSerializer(asset)
        json_string = (
            JSONRenderer().render(assigned_asset_serializer.data).decode("utf-8")
        )
        email_service.send_email(
            message,
            "Serializer Data: {}".format(json_string),
            [
                "astg7542@gmail.com",
                "acj88178@gmail.com",
                "asimapalexperion23@gmail.com",
                "aidrin.varghese@experionglobal.com",
                "pavithraexperion@gmail.com",
            ],
        )

        return message
