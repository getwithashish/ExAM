# asset_assign_service.py
from rest_framework import status
from asset.models import Employee, Asset
from messages import (
    UNAUTHORIZED_NO_PERMISSION,
    EMPLOYEE_NOT_FOUND_ERROR,
    STATUS_EXPIRED_OR_DISPOSED,
    ASSET_NOT_FOUND,
)
from asset.service.asset_assign_service.asset_sysadmin_role_assignasset_service import (
    AssetSysadminRoleAssignService,
)
from asset.service.asset_assign_service.asset_lead_role_assignasset_service import (
    AssetLeadRoleAssignService,
)
from notification.service.email_service import EmailService

class AssignAssetService:
    @staticmethod
    def assign_asset(requester_role, asset_uuid, employee_id, requester):
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return {"message": EMPLOYEE_NOT_FOUND_ERROR, "status": status.HTTP_404_NOT_FOUND}
        
        try:
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return {"message": ASSET_NOT_FOUND, "status": status.HTTP_404_NOT_FOUND}

        if asset.status in ["EXPIRED", "DISPOSED"]:
            return {"message": STATUS_EXPIRED_OR_DISPOSED, "status": status.HTTP_400_BAD_REQUEST}

        if requester_role == "SYSTEM_ADMIN":
            message = AssetSysadminRoleAssignService.assign_asset(asset, employee, requester)
        elif requester_role == "LEAD":
            message = AssetLeadRoleAssignService.assign_asset(asset, employee, requester)
        else:
            return {"message": UNAUTHORIZED_NO_PERMISSION, "status": status.HTTP_403_FORBIDDEN}

        if not message:
            return {"message": "Failed to assign asset", "status": status.HTTP_500_INTERNAL_SERVER_ERROR}

        # Determine the recipient and adjust email content accordingly
        if employee == requester:
            recipient = f"Dear {employee.employee_name},\n\nWe are pleased to inform you that the following asset has been assigned to you:\n\n"
        else:
            recipient = f"Dear {employee.employee_name},\n\nThe following asset has been assigned to you:\n\n"

        # Create a more structured and professional email content
        email_subject = "Asset Assignment Notification"
        
        email_body = (
            f"{recipient}"
            f"Asset Name: {asset.product_name}\n"
            f"Model: {asset.model_number}\n"
            f"Serial Number: {asset.serial_number}\n"
            f"Asset Status: {asset.status}\n"
            f"Date of Purchase: {asset.date_of_purchase}\n"
            f"Location: {asset.location}\n"
            f"Business Unit: {asset.business_unit}\n"
            f"Operating System: {asset.os}\n"
            f"OS Version: {asset.os_version}\n"
            f"Processor: {asset.processor}\n"
            f"Memory: {asset.memory}\n"
            f"Storage: {asset.storage}\n"
            f"Configuration: {asset.configuration}\n"
            f"Accessories: {asset.accessories}\n"
            f"Notes: {asset.notes}\n\n"
            f"Please ensure that you handle it with care and adhere to all the usage guidelines provided.\n\n"
            f"This assignment was processed by {requester.get_full_name()}.\n\n"
            f"Terms and Conditions: Please adhere to all company policies regarding asset usage and maintenance."
            f"Unauthorized modifications or misuse of company assets may result in disciplinary action.\n\n"
            f"For repairs or other inquiries, please contact our IT support team at support@example.com or call us at +1 234-567-8901.\n"
        )

        # Send email
        email_service = EmailService()
        try:
            email_service.send_email(
                email_subject,
                email_body,
        [
            "astg7542@gmail.com",
            "acj88178@gmail.com",
            "asimapalexperion23@gmail.com",
            "aidrin.varghese@experionglobal.com",
            "pavithraexperion@gmail.com",
        ],
                
            )
        except Exception as e:
            return {"message": "Asset assigned but failed to send notification email.", "status": status.HTTP_500_INTERNAL_SERVER_ERROR}

        return {"message": "Asset assigned successfully and email notification sent.", "status": status.HTTP_200_OK}
