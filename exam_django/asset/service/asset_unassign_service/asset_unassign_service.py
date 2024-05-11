
from exceptions import PermissionDeniedException
from asset.service.asset_unassign_service.asset_unassign_sys_admin_service import (
    AssetSysadminRoleUnassignService,
)
from asset.service.asset_unassign_service.asset_unassign_lead_service import (
    AssetLeadRoleUnassignService,
)
from rest_framework import status
from messages import USER_UNAUTHORIZED
from notification.service.email_service import EmailService
from rest_framework.renderers import JSONRenderer
from asset.serializers import AssignAssetSerializer
from asset.models import Asset
from asset.models.employee import Employee  # Import the Employee model
 
class UnassignAssetService:
    @staticmethod
    def unassign_asset(requester_role, asset_uuid, requester, custodian_id=None):
        try:
            # Retrieve the asset with the specified UUID
            asset = Asset.objects.get(asset_uuid=asset_uuid)
 
            # Determine which service to use based on requester role
            if requester_role == "SYSTEM_ADMIN":
                asset_user_role_unassign_service = AssetSysadminRoleUnassignService()
            elif requester_role == "LEAD":
                asset_user_role_unassign_service = AssetLeadRoleUnassignService()
            else:
                raise PermissionDeniedException(
                    {}, USER_UNAUTHORIZED, status.HTTP_401_UNAUTHORIZED
                )
 
            # Perform asset unassignment using the appropriate service
            asset, message, email_subject = asset_user_role_unassign_service.unassign_asset(
                asset, requester
            )
 
            #Save the asset after unassignment
            asset.save()
            # Send email notification
            email_service = EmailService()
            assigned_asset_serializer = AssignAssetSerializer(asset)
            json_string = JSONRenderer().render(assigned_asset_serializer.data).decode("utf-8")
 
            # Compose email content
            email_content = (
                f"Dear Lead,\n\n"
                f"We would like to inform you that an asset that was once allocated to {custodian_id} has now been deallocated from {custodian_id}. "
                f"The asset is now back in stock and available for reassignment.\n\n"
                f"Details of the asset:\n"
                f"Asset Name: {asset.product_name}\n"
                f"Asset ID: {asset.asset_uuid}\n"
                f"Asset Status: In Stock\n\n"
                f"For more details you can login and view the dashboard of Asset Management System\n"
                f"Regards and Thank you.\n"
                f"System Facility Management (SFM)\nExperion Technologies\n\n\nAustralia | Germany | India | Netherlands | Switzerland | UK | USA\nClutch - Top 20 Digital Solutions - Worldwide; Texas Top 100\nGreat Place to Work 2021\nMajor Contender - Everest Group's Digital Product Engineering Peak Matrix Assessment 2022\n2022 Frost & Sullivan Global Software Product Engineering Customer Value Leadership Award\nInc. 5000- 4-time winner."
            )
 
            recipients = [  "asimapalexperion23@gmail.com",
                            "astg7542@gmail.com",
                            "acj88178@gmail.com",
                            "aidrin.varghese@experionglobal.com",
                            "pavithraexperion@gmail.com",]
 
            # Send email using EmailService
            email_service.send_email(email_subject, email_content, recipients)
 
            return assigned_asset_serializer.data, message, status.HTTP_202_ACCEPTED
 
        except Asset.DoesNotExist:
            return None, "Asset not found", status.HTTP_404_NOT_FOUND
 
        except Employee.DoesNotExist:
            return None, "Custodian not found", status.HTTP_404_NOT_FOUND
 
        except PermissionDeniedException as e:
            return None, str(e), status.HTTP_401_UNAUTHORIZED
 