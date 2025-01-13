# asset_assign_service.py
from rest_framework import status
from asset.models import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from asset.models.business_unit import BusinessUnit
from employee.models import Employee
from notification.service.notification_service import NotificationService
from messages import (
    ASSET_CONFLICT,
    BUSINESS_UNIT_NOT_FOUND,
    UNAUTHORIZED_NO_PERMISSION,
    EMPLOYEE_NOT_FOUND_ERROR,
    STATUS_EXPIRED_OR_DISPOSED,
    ASSET_NOT_FOUND,
)
from asset.service.asset_assign_service.asset_sysadmin_role_assignasset_service import (
    AssetSysadminRoleAssignService,
)
from exceptions import (
    ConflictException,
    NotAcceptableOperationException,
    NotFoundException,
    PermissionDeniedException,
)


class AssignAssetService:
    @staticmethod
    def assign_asset(
        requester_role, asset_uuid, employee_id, business_unit, requester, version
    ):
        try:
            notification_service = NotificationService()

            employee = Employee.objects.get(id=employee_id)
            asset = Asset.objects.get(asset_uuid=asset_uuid)
            business_unit = BusinessUnit.objects.get(id=business_unit)

            old_asset_data = AssetReadSerializer(asset).data

        except Employee.DoesNotExist:
            raise NotFoundException(
                {}, EMPLOYEE_NOT_FOUND_ERROR, status.HTTP_404_NOT_FOUND
            )

        except Asset.DoesNotExist:
            raise NotFoundException({}, ASSET_NOT_FOUND, status.HTTP_404_NOT_FOUND)

        except BusinessUnit.DoesNotExist:
            raise NotFoundException(
                {}, BUSINESS_UNIT_NOT_FOUND, status.HTTP_404_NOT_FOUND
            )

        if asset.status in ["DAMAGED", "OUTDATED", "REPAIR", "SCRAP"]:
            raise NotAcceptableOperationException(
                {}, STATUS_EXPIRED_OR_DISPOSED, status.HTTP_406_NOT_ACCEPTABLE
            )

        if requester_role == "SYSTEM_ADMIN":
            asset, message, email_subject = AssetSysadminRoleAssignService.assign_asset(
                asset, employee, business_unit, requester
            )
        else:
            raise PermissionDeniedException(
                {}, UNAUTHORIZED_NO_PERMISSION, status.HTTP_403_FORBIDDEN
            )

        if asset.version != version:
            raise ConflictException({}, ASSET_CONFLICT, status.HTTP_409_CONFLICT)

        asset.version = asset.version + 1
        asset.save()
        assigned_asset_serializer = AssetReadSerializer(asset)

        asset_dict = assigned_asset_serializer.data.copy()
        asset_dict["old_asset_data"] = old_asset_data

        notification_service.send_notification(
            subject=email_subject, message=message, **asset_dict
        )

        return assigned_asset_serializer.data, message, status.HTTP_202_ACCEPTED
