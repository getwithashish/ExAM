from rest_framework import status
from asset.service.email_format_services.sysadmin_request_approval_formats import EmailApprovalFormats
from asset.models import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from notification.service.email_service import EmailService

class AssetApproveService:

    def __init__(self, asset_user_role_approve_service):
        self.asset_user_role_approve_service = asset_user_role_approve_service

    def approve_request(self, request):
        email_service = EmailService()

        asset_uuid = request.data.get("asset_uuid")
        print("Assset uuid:", asset_uuid)
        
        try:
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return None, "Asset not found", status.HTTP_404_NOT_FOUND

        asset_detail_status = asset.asset_detail_status
        asset_assign_status = asset.assign_status
        print("Asset assign status:", asset_assign_status)
        print("Asset detail status:", asset_detail_status)
        print("request.data is " , request.data)

        comments = request.data.get("comments")
        print("Comments:", comments)
        custodian_name = asset.custodian
        print("Custodian:", custodian_name)

        asset.approved_by = request.user
        asset.approval_status_message = comments

        asset, message, email_subject = self.asset_user_role_approve_service.approve_request(asset, request)
        asset.save()

        serializer = AssetReadSerializer(asset)

        # Determine email format and subject

        if asset_detail_status == "UPDATE_PENDING":
            email_body = EmailApprovalFormats.format_approval_modification_email_body(asset, comments)
            email_subject = "ASSET UPDATION SUCCESSFUL"
        else:
            email_body = EmailApprovalFormats.format_approval_creation_email_body(asset, comments)
            email_subject = "ASSET CREATION SUCCESSFUL"

        if asset_assign_status == "ASSIGNMENT_PENDING":
            email_body = EmailApprovalFormats.format_approval_allocation_email_body(asset, comments)
            email_subject = "ASSET ALLOCATION SUCCESSFUL"

        if custodian_name is not None:
            email_body = EmailApprovalFormats.format_approval_deallocation_email_body(asset, comments)
            email_subject = "ASSET DEALLOCATION SUCCESSFUL"

        # Send Email
        email_service.send_email(email_subject, email_body, ["asimapalexperion23@gmail.com"])
        print("Serialized data:", serializer.data)

        return serializer.data, message, status.HTTP_202_ACCEPTED

    def reject_request(self, request):
        email_service = EmailService()

        asset_uuid = request.data.get("asset_uuid")
        comments = request.data.get("comments")

        try:
            asset = Asset.objects.get(asset_uuid=asset_uuid)
        except Asset.DoesNotExist:
            return None, "Asset not found", status.HTTP_404_NOT_FOUND

        asset.approved_by = request.user
        asset.approval_status_message = comments

        asset, message, email_subject = self.asset_user_role_approve_service.reject_request(asset, request)
        asset.save()

        serializer = AssetReadSerializer(asset)

        # Send Email
        email_body = EmailApprovalFormats.format_rejection_email_body(asset, comments)
        email_service.send_email(email_subject, email_body, ["asimapalexperion23@gmail.com"])
        print("Serialized data:", serializer.data)

        return serializer.data, message, status.HTTP_202_ACCEPTED
