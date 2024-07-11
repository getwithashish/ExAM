# asset_assign_service.py
from rest_framework import status
from asset.models import Employee, Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from utils.celery_status_checker import CeleryStatusChecker
from messages import (
    UNAUTHORIZED_NO_PERMISSION,
    EMPLOYEE_NOT_FOUND_ERROR,
    STATUS_EXPIRED_OR_DISPOSED,
    ASSET_NOT_FOUND,
)
from asset.service.asset_assign_service.asset_sysadmin_role_assignasset_service import (
    AssetSysadminRoleAssignService,
)
from exceptions import (
    NotAcceptableOperationException,
    NotFoundException,
    PermissionDeniedException,
)
from notification.utils.email_body_contents.lead_email_body_contents import (
    construct_allocate_asset_email_body_content,
)
from notification.service.email_service import send_email


class AssignAssetService:
    @staticmethod
    def assign_asset(requester_role, asset_uuid, employee_id, requester):
        try:
            employee = Employee.objects.get(id=employee_id)
            asset = Asset.objects.get(asset_uuid=asset_uuid)

        except Employee.DoesNotExist:
            raise NotFoundException(
                {}, EMPLOYEE_NOT_FOUND_ERROR, status.HTTP_404_NOT_FOUND
            )

        except Asset.DoesNotExist:
            raise NotFoundException({}, ASSET_NOT_FOUND, status.HTTP_404_NOT_FOUND)

        if asset.status in ["DAMAGED", "REPAIR", "SCRAP"]:
            raise NotAcceptableOperationException(
                {}, STATUS_EXPIRED_OR_DISPOSED, status.HTTP_406_NOT_ACCEPTABLE
            )

        if requester_role == "SYSTEM_ADMIN":
            asset, message, email_subject = AssetSysadminRoleAssignService.assign_asset(
                asset, employee, requester
            )
        else:
            raise PermissionDeniedException(
                {}, UNAUTHORIZED_NO_PERMISSION, status.HTTP_403_FORBIDDEN
            )

        asset.save()
        assigned_asset_serializer = AssetReadSerializer(asset)

        email_body = construct_allocate_asset_email_body_content(
            **assigned_asset_serializer.data
        )

        if CeleryStatusChecker.check_celery_status():
            send_email.delay(
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

        return assigned_asset_serializer.data, message, status.HTTP_202_ACCEPTED
