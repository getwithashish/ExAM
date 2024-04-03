from response import APIResponse
from asset.service.unassign_service.unassign_sys_admin_service import (
    AssetSysadminRoleUnassignService,
)
from asset.service.unassign_service.unassign_lead_service import (
    AssetLeadRoleUnassignService,
)
from rest_framework import status
from messages import (
    UNAUTHORIZED_NO_PERMISSION,
    ASSET_NOT_FOUND,
)
from notification.service.email_service import EmailService
from rest_framework.renderers import JSONRenderer
from asset.serializers import AssignAssetSerializer
from asset.models import Asset


class UnassignAssetService:
    @staticmethod
    def unassign_asset(requester_role, asset_uuid, requester):

        try:
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return APIResponse(
                message=ASSET_NOT_FOUND,
                status=status.HTTP_404_NOT_FOUND,
            )

        if requester_role == "SYSTEM_ADMIN":
            asset_user_role_unassign_service = AssetSysadminRoleUnassignService()
        elif requester_role == "LEAD":
            asset_user_role_unassign_service = AssetLeadRoleUnassignService()
        else:
            # Only return error message and status code for unauthorized roles
            return {
                "message": UNAUTHORIZED_NO_PERMISSION,
                "status": status.HTTP_403_FORBIDDEN,
            }

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
