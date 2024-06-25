from rest_framework import status

from asset.models import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from utils.celery_status_checker import CeleryStatusChecker
from notification.utils.email_body_contents.system_admin_email_body_contents import (
    construct_allocation_approval_email_body,
    construct_allocation_rejection_email_body,
    construct_creation_approval_email_body,
    construct_creation_rejection_email_body,
    construct_deallocation_approval_email_body,
    construct_deallocation_rejection_email_body,
    construct_modification_approval_email_body,
    construct_modification_rejection_email_body,
)
from messages import (
    ASSET_CREATION_REJECTED,
    ASSET_SUCCESSFULLY_ASSIGNED,
    ASSET_SUCCESSFULLY_CREATED,
    ASSET_SUCCESSFULLY_UNASSIGNED,
    ASSET_SUCCESSFULLY_UPDATED,
    ASSET_UPDATION_REJECTED,
    ASSIGN_ASSET_REJECT_SUCCESSFUL,
    UNASSIGN_ASSET_REJECT_SUCCESSFUL,
)
from notification.service.email_service import send_email


class AssetApproveService:

    def __init__(self, asset_user_role_approve_service):
        self.asset_user_role_approve_service = asset_user_role_approve_service

    def approve_request(self, request):
        asset_uuid = request.data.get("asset_uuid")
        comments = request.data.get("comments")
        asset = Asset.objects.get(asset_uuid=asset_uuid)
        asset.approved_by = request.user
        asset.approval_status_message = comments

        asset, message, email_subject = (
            self.asset_user_role_approve_service.approve_request(asset, request)
        )

        asset.save()
        serializer = AssetReadSerializer(asset)

        if message == ASSET_SUCCESSFULLY_CREATED:
            email_body = construct_creation_approval_email_body(**serializer.data)
        elif message == ASSET_SUCCESSFULLY_UPDATED:
            email_body = construct_modification_approval_email_body(**serializer.data)
        elif message == ASSET_SUCCESSFULLY_ASSIGNED:
            email_body = construct_allocation_approval_email_body(**serializer.data)
        elif message == ASSET_SUCCESSFULLY_UNASSIGNED:
            email_body = construct_deallocation_approval_email_body(**serializer.data)

        # Send Email
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
        print(serializer.data)

        return serializer.data, message, status.HTTP_202_ACCEPTED

    def reject_request(self, request):
        asset_uuid = request.data.get("asset_uuid")
        comments = request.data.get("comments")
        asset = Asset.objects.get(asset_uuid=asset_uuid)
        asset.approved_by = request.user
        asset.approval_status_message = comments

        asset, message, email_subject = (
            self.asset_user_role_approve_service.reject_request(asset, request)
        )

        asset.save()
        serializer = AssetReadSerializer(asset)

        if message == ASSET_CREATION_REJECTED:
            email_body = construct_creation_rejection_email_body(**serializer.data)
        elif message == ASSET_UPDATION_REJECTED:
            email_body = construct_modification_rejection_email_body(**serializer.data)
        elif message == ASSIGN_ASSET_REJECT_SUCCESSFUL:
            email_body = construct_allocation_rejection_email_body(**serializer.data)
        elif message == UNASSIGN_ASSET_REJECT_SUCCESSFUL:
            email_body = construct_deallocation_rejection_email_body(**serializer.data)

        # Send Email
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
        print(serializer.data)

        return serializer.data, message, status.HTTP_202_ACCEPTED
