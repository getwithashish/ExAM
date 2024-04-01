from rest_framework.renderers import JSONRenderer
from rest_framework import status

from asset.models import Asset
from asset.serializers.AssetSerializer import AssetReadSerializer
from notification.service.EmailService import EmailService


class AssetApproveService:

    def __init__(self, asset_user_role_approve_service):
        self.asset_user_role_approve_service = asset_user_role_approve_service

    def approve_request(self, request):
        email_service = EmailService()

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

        # Send Email
        json_string = JSONRenderer().render(serializer.data).decode("utf-8")
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
        print(serializer.data)

        return serializer.data, message, status.HTTP_202_ACCEPTED

    def reject_request(self, request):
        email_service = EmailService()

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

        # Send Email
        json_string = JSONRenderer().render(serializer.data).decode("utf-8")
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
        print(serializer.data)

        return serializer.data, message, status.HTTP_202_ACCEPTED
