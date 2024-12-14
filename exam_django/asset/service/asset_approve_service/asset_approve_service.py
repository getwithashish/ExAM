from rest_framework import status

from asset.models import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from asset.signals.asset_previous_value_signal import asset_previous_value_signal
from notification.service.notification_service import NotificationService
from exceptions import ConflictException
from messages import (
    ASSET_CONFLICT,
)


class AssetApproveService:

    def __init__(self, asset_user_role_approve_service):
        self.asset_user_role_approve_service = asset_user_role_approve_service
        self.notification_service = NotificationService()

    def approve_request(self, request):
        asset_uuid = request.data.get("asset_uuid")
        comments = request.data.get("comments")
        version = request.data.get("version")

        asset = Asset.objects.get(asset_uuid=asset_uuid)

        old_asset_data = AssetReadSerializer(asset).data

        if asset.version != version:
            raise ConflictException({}, ASSET_CONFLICT, status.HTTP_409_CONFLICT)

        asset_previous_value_signal.send(sender=Asset, instance=asset)

        asset, message, email_subject = (
            self.asset_user_role_approve_service.approve_request(asset, request)
        )
        asset.approved_by = request.user
        asset.approval_status_message = comments
        asset.version = asset.version + 1

        asset.save()
        serializer = AssetReadSerializer(asset)

        asset_dict = serializer.data.copy()
        asset_dict["old_asset_data"] = old_asset_data

        self.notification_service.send_notification(
            subject=email_subject, message=message, **asset_dict
        )

        return serializer.data, message, status.HTTP_202_ACCEPTED

    def reject_request(self, request):
        asset_uuid = request.data.get("asset_uuid")
        comments = request.data.get("comments")
        version = request.data.get("version")

        asset = Asset.objects.get(asset_uuid=asset_uuid)

        old_asset_data = AssetReadSerializer(asset).data

        if asset.version != version:
            raise ConflictException({}, ASSET_CONFLICT, status.HTTP_409_CONFLICT)

        asset_previous_value_signal.send(sender=Asset, instance=asset)

        asset, message, email_subject = (
            self.asset_user_role_approve_service.reject_request(asset, request)
        )
        asset.approved_by = request.user
        asset.approval_status_message = comments
        asset.version = asset.version + 1

        asset.save()
        serializer = AssetReadSerializer(asset)

        asset_dict = serializer.data.copy()
        asset_dict["old_asset_data"] = old_asset_data

        self.notification_service.send_notification(
            subject=email_subject, message=message, **asset_dict
        )

        return serializer.data, message, status.HTTP_202_ACCEPTED
