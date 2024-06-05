from asset.serializers.asset_serializer import AssetReadSerializer
from exceptions import NotFoundException, PermissionDeniedException
from asset.service.asset_unassign_service.asset_unassign_sys_admin_service import (
    AssetSysadminRoleUnassignService,
)
from rest_framework import status
from messages import (
    ASSET_NOT_FOUND,
    EMPLOYEE_NOT_FOUND_ERROR,
    UNAUTHORIZED_NO_PERMISSION,
    USER_UNAUTHORIZED,
)
from notification.service.email_service import EmailService
from asset.serializers import AssignAssetSerializer
from asset.models import Asset
from asset.models.employee import Employee  # Import the Employee model
from notification.utils.email_body_contents.lead_email_body_contents import (
    construct_deallocate_asset_email_body_content,
)


class UnassignAssetService:
    @staticmethod
    def unassign_asset(requester_role, asset_uuid, requester, custodian=None):
        try:
            # Retrieve the asset with the specified UUID
            asset = Asset.objects.get(asset_uuid=asset_uuid)
            asset_to_be_unassigned_serializer = AssetReadSerializer(asset)

            print("Asset to be unassigned: ", asset_to_be_unassigned_serializer.data)

            # Determine which service to use based on requester role
            if requester_role == "SYSTEM_ADMIN":
                asset_user_role_unassign_service = AssetSysadminRoleUnassignService()
            else:
                raise PermissionDeniedException(
                    {}, USER_UNAUTHORIZED, status.HTTP_401_UNAUTHORIZED
                )

            # Perform asset unassignment using the appropriate service
            asset, message, email_subject = (
                asset_user_role_unassign_service.unassign_asset(asset, requester)
            )

            # Save the asset after unassignment
            asset.save()
            unassigned_asset_serializer = AssignAssetSerializer(asset)

            # Send email notification
            email_service = EmailService()

            # Compose email content
            email_content = construct_deallocate_asset_email_body_content(**asset_to_be_unassigned_serializer.data)

            recipients = [
                "asimapalexperion23@gmail.com",
                "astg7542@gmail.com",
                "acj88178@gmail.com",
                "aidrin.varghese@experionglobal.com",
                "pavithraexperion@gmail.com",
            ]

            # Send email using EmailService
            email_service.send_email(email_subject, email_content, recipients)

            return unassigned_asset_serializer.data, message, status.HTTP_202_ACCEPTED

        except Asset.DoesNotExist:
            raise NotFoundException({}, ASSET_NOT_FOUND, status.HTTP_404_NOT_FOUND)

        except Employee.DoesNotExist:
            raise NotFoundException(
                {}, EMPLOYEE_NOT_FOUND_ERROR, status.HTTP_404_NOT_FOUND
            )

        except PermissionDeniedException:
            raise PermissionDeniedException(
                {}, UNAUTHORIZED_NO_PERMISSION, status.HTTP_403_FORBIDDEN
            )
