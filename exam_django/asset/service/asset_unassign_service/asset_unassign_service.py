from rest_framework import status

from asset.serializers.asset_serializer import AssetReadSerializer
from employee.models.employee import Employee
from notification.service.notification_service import NotificationService
from exceptions import ConflictException, NotFoundException, PermissionDeniedException
from asset.service.asset_unassign_service.asset_unassign_sys_admin_service import (
    AssetSysadminRoleUnassignService,
)
from messages import (
    ASSET_CONFLICT,
    ASSET_NOT_FOUND,
    EMPLOYEE_NOT_FOUND_ERROR,
    UNAUTHORIZED_NO_PERMISSION,
    USER_UNAUTHORIZED,
)
from asset.models import Asset


class UnassignAssetService:
    """
    Service class to handle asset unassignment according to user role
    """
    @staticmethod
    def unassign_asset(requester_role, asset_uuid, requester, version, custodian=None) -> tuple:
        """
        Unassign an asset given the asset and the requester.

        Args:
            asset (Asset): The asset to unassign.
            requester: The user requesting the unassignment.

        Raises:
            NotAcceptableOperationException: If the asset is in an unassignable state.
            ConflictException: If there is any conflict in the version,

        Returns:
            tuple: A tuple containing the updated asset, a message, and the email subject.
        """
        try:
            notification_service = NotificationService()

            # Retrieve the asset with the specified UUID
            asset = Asset.objects.get(asset_uuid=asset_uuid)
            asset_to_be_unassigned_serializer = AssetReadSerializer(asset)

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

            if asset.version != version:
                raise ConflictException({}, ASSET_CONFLICT, status.HTTP_409_CONFLICT)

            asset.version = asset.version + 1
            asset.save()
            # unassigned_asset_serializer = AssignAssetSerializer(asset)
            unassigned_asset_serializer = AssetReadSerializer(asset)

            asset_dict = unassigned_asset_serializer.data.copy()
            asset_dict["old_asset_data"] = asset_to_be_unassigned_serializer.data.copy()

            notification_service.send_notification(
                subject=email_subject, message=message, **asset_dict
            )

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
