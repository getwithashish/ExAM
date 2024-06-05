from rest_framework import status

from asset.models import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from asset.service.asset_approve_service.email_approval_formats import (
    EmailApprovalFormats,
)
from notification.service.email_service import EmailService
from asset.service.asset_approve_service.email_reject_formats import (
    EmailRejectionFormats,
)

# rom asset.service.asset_approve_service.email_approval_formats import format_approval_creation_email_body


class AssetApproveService:

    def __init__(self, asset_user_role_approve_service):
        self.asset_user_role_approve_service = asset_user_role_approve_service

    def approve_request(self, request):
        email_service = EmailService()

        asset_uuid = request.data.get("asset_uuid")
        comments = request.data.get("comments")
        asset = Asset.objects.get(asset_uuid=asset_uuid)
        asset_detail_status = asset.asset_detail_status
        assign_status = asset.assign_status
        custodian_name = asset.custodian
        asset.approved_by = request.user
        asset.approval_status_message = comments
        asset_category = asset.asset_category

        asset, message, email_subject = (
            self.asset_user_role_approve_service.approve_request(asset, request)
        )

        asset.save()
        serializer = AssetReadSerializer(asset)

        # Determine email format and subject

        if asset_detail_status == "UPDATE_PENDING" and (
            assign_status == "ASSIGNED"
            or assign_status == "UNASSIGNED"
            or assign_status == "REJECTED"
        ):
            email_body, email_subject = (
                EmailApprovalFormats.format_approval_modification_email_body(
                    asset, comments, asset_category
                )
            )

        if asset_detail_status == "CREATE_PENDING":
            email_body, email_subject = (
                EmailApprovalFormats.format_approval_creation_email_body(
                    asset, comments, asset_category
                )
            )

        if assign_status == "ASSIGN_PENDING" and (
            asset_detail_status == "CREATED"
            or asset_detail_status == "UPDATE_PENDING"
            or asset_detail_status == "UPDATED"
            or asset_detail_status == "UPDATE_REJECTED"
        ):
            email_body, email_subject = (
                EmailApprovalFormats.format_approval_allocation_email_body(
                    asset, comments, asset_category
                )
            )

        if custodian_name is None and (
            asset_detail_status == "CREATED"
            or asset_detail_status == "UPDATE_PENDING"
            or asset_detail_status == "UPDATED"
            or asset_detail_status == "UPDATE_REJECTED"
        ):
            email_body, email_subject = (
                EmailApprovalFormats.format_approval_deallocation_email_body(
                    asset, comments, asset_category
                )
            )

        # Send Email
        email_service.send_email(
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
        email_service = EmailService()
        asset_uuid = request.data.get("asset_uuid")
        comments = request.data.get("comments")
        asset = Asset.objects.get(asset_uuid=asset_uuid)
        asset.approved_by = request.user
        asset.approval_status_message = comments
        asset_detail_status = asset.asset_detail_status

        assign_status = asset.assign_status

        custodian_name = asset.custodian

        asset_category = asset.asset_category

        asset, message, email_subject = (
            self.asset_user_role_approve_service.reject_request(asset, request)
        )

        asset.save()
        serializer = AssetReadSerializer(asset)

        # Determine email format and subject

        if asset_detail_status == "UPDATE_PENDING" and (
            assign_status == "ASSIGNED"
            or assign_status == "UNASSIGNED"
            or assign_status == "REJECTED"
        ):
            email_body = EmailRejectionFormats.format_rejection_modification_email_body(
                asset, comments, asset_category
            )

        if asset_detail_status == "CREATE_PENDING":
            email_body, email_subject = (
                EmailRejectionFormats.format_rejection_creation_email_body(
                    asset, comments, asset_category
                )
            )

        if assign_status == "ASSIGN_PENDING" and (
            asset_detail_status == "CREATED"
            or asset_detail_status == "UPDATE_PENDING"
            or asset_detail_status == "UPDATED"
            or asset_detail_status == "UPDATE_REJECTED"
        ):
            email_body, email_subject = (
                EmailRejectionFormats.format_rejection_allocation_email_body(
                    asset, comments, asset_category
                )
            )

        if custodian_name is None and (
            asset_detail_status == "CREATED"
            or asset_detail_status == "UPDATE_PENDING"
            or asset_detail_status == "UPDATED"
            or asset_detail_status == "UPDATE_REJECTED"
        ):
            email_body, email_subject = (
                EmailRejectionFormats.format_rejection_deallocation_email_body(
                    asset, comments, asset_category
                )
            )

        # Send Email
        email_service.send_email(
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
