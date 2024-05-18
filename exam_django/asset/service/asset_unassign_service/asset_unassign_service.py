from exceptions import PermissionDeniedException
from asset.service.asset_unassign_service.asset_unassign_sys_admin_service import (
    AssetSysadminRoleUnassignService,
)
from rest_framework import status
from messages import (
    USER_UNAUTHORIZED,
)
from notification.service.email_service import EmailService
from rest_framework.renderers import JSONRenderer
from asset.serializers import AssignAssetSerializer
from asset.models import Asset


class UnassignAssetService:
    @staticmethod
    def unassign_asset(requester_role, asset_uuid, requester):

        asset = Asset.objects.get(asset_uuid=asset_uuid)

        if requester_role == "SYSTEM_ADMIN":
            asset_user_role_unassign_service = AssetSysadminRoleUnassignService()
        else:
            raise PermissionDeniedException(
                {}, USER_UNAUTHORIZED, status.HTTP_401_UNAUTHORIZED
            )

        asset, message, email_subject = asset_user_role_unassign_service.unassign_asset(
            asset, requester
        )

        asset.save()

        # Send email
        email_service = EmailService()
        assigned_asset_serializer = AssignAssetSerializer(asset)
        json_string = (
            JSONRenderer().render(assigned_asset_serializer.data).decode("utf-8")
        )
        email_service.send_email(
            email_subject,
            "Serializer Data: {}".format(json_string),
            [
                "astg7542@gmail.com",
                "acj88178@gmail.com",
                "asimapalexperion23@gmail.com",
                "aidrin.varghese@experionglobal.com",
                "pavithraexperion@gmail.com",
            ],
        )

        return assigned_asset_serializer.data, message, status.HTTP_202_ACCEPTED
