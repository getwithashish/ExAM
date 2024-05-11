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
            return {
                "message": EMPLOYEE_NOT_FOUND_ERROR,
                "status": status.HTTP_404_NOT_FOUND,
            }

        try:
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return {"message": ASSET_NOT_FOUND, "status": status.HTTP_404_NOT_FOUND}

        if asset.status in ["EXPIRED", "DISPOSED"]:
            return {
                "message": STATUS_EXPIRED_OR_DISPOSED,
                "status": status.HTTP_400_BAD_REQUEST,
            }

        if requester_role == "SYSTEM_ADMIN":
            message = AssetSysadminRoleAssignService.assign_asset(
                asset, employee, requester
            )
        elif requester_role == "LEAD":
            message = AssetLeadRoleAssignService.assign_asset(
                asset, employee, requester
            )
        else:
            return {
                "message": UNAUTHORIZED_NO_PERMISSION,
                "status": status.HTTP_403_FORBIDDEN,
            }

        if not message:
            return {
                "message": "Failed to assign asset",
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
            }

        # Determine the recipient and adjust email content accordingly
        # if employee == requester:
        recipient = f"{employee.employee_name}\n\n"
        # else:
        #     recipient = f"Dear {employee.employee_name},\n\nThe following asset has been assigned to you:\n\n"

        # Create a more structured and professional email content
        email_subject = "Asset Assignment Notification"

        email_body = (
            f"Dear Lead,\n\n"
            f"The asset given below has been assigned to {recipient}."
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
            f"Please ensure that the asset is handled with care and he/she adheres to all the usage guidelines provided.\n\n"
            f"\nFor more details you can login and view the dashboard of Asset Management System\n"
            f"Regards and Thank you.\n\n"
            f"System Facility Management (SFM)\nExperion Technologies\n\nAustralia | Germany | India | Netherlands | Switzerland | UK | USA\nClutch - Top 20 Digital Solutions - Worldwide; Texas Top 100\nGreat Place to Work 2021\nMajor Contender - Everest Group's Digital Product Engineering Peak Matrix Assessment 2022\n2022 Frost & Sullivan Global Software Product Engineering Customer Value Leadership Award\nInc. 5000- 4-time winner."
        )

        # Send email
        email_service = EmailService()
        try:
            email_service.send_email(
                email_subject,
                email_body,
                [
                    "asimapalexperion23@gmail.com",
                    "astg7542@gmail.com",
                    "acj88178@gmail.com",
                    "aidrin.varghese@experionglobal.com",
                    "pavithraexperion@gmail.com",
                ],
            )
        except Exception as e:
            return {
                "message": "Asset assigned but failed to send notification email.",
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
            }

        return {
            "message": "Asset assigned successfully and email notification sent.",
            "status": status.HTTP_200_OK,
        }
