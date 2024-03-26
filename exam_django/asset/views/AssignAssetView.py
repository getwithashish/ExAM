from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.models import Asset, Employee
from asset.serializers import AssignAssetSerializer
from rest_framework.renderers import JSONRenderer
from notification.service.EmailService import EmailService

from response import APIResponse
from messages import (
    ASSET_SUCCESSFULLY_ASSIGNED,
    ASSET_NOT_FOUND,
    EMPLOYEE_NOT_FOUND_ERROR,
)


class AssignAssetView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request):
        email_service = EmailService()
        serializer = AssignAssetSerializer(data=request.data)
        if serializer.is_valid():
            requester = request.user
            role = requester.user_scope

            # Check if the requester is a system admin
            if role == "SYSTEM_ADMIN":
                requester_role = "SYSTEM_ADMIN"
                allowed_statuses = ["UNASSIGNED", "REJECTED"]

            # Check if the requester is a lead
            elif role == "LEAD":
                requester_role = "LEAD"
                allowed_statuses = ["UNASSIGNED", "REJECTED"]

            # Manager doesn't have permission to assign assets
            elif role == "MANAGER":
                return APIResponse(
                    message="Unauthorized. You do not have permission to assign assets.",
                    status=status.HTTP_403_FORBIDDEN,
                )

            try:
                employee_id = request.data.get("id")
                employee = Employee.objects.get(id=employee_id)
            except Employee.DoesNotExist:
                return APIResponse(
                    message=EMPLOYEE_NOT_FOUND_ERROR,
                    status=status.HTTP_404_NOT_FOUND,
                )

            asset_id = request.data.get("asset_uuid")
            try:
                asset = Asset.objects.get(asset_uuid=asset_id)
            except Asset.DoesNotExist:
                return APIResponse(
                    message=ASSET_NOT_FOUND,
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Check if the asset status is expired or disposed
            if asset.status in ["EXPIRED", "DISPOSED"]:
                return APIResponse(
                    message="Cannot assign the asset. Status is expired or disposed.",
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if the asset assign status is allowed
            if asset.assign_status not in allowed_statuses:
                return APIResponse(
                    message="Cannot assign the asset. Assignment is pending or already assigned.",
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Assign the asset
            if requester_role == "LEAD":
                asset.assign_status = "ASSIGNED"
                asset.status = "IN USE"
                email_subject = "ASSET ASSIGNMENT SUCCESSFUL"

            else:
                asset.assign_status = "ASSIGN_PENDING"
                email_subject = "ASSET ASSIGNMENT REQUEST SENT"

            asset.custodian = employee
            asset.requester = requester
            asset.save()

            # Serialize the assigned asset using the custom serializer
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
                    "pavithravprabhu6@gmail.com",
                ],
            )

            return APIResponse(
                data=assigned_asset_serializer.data,
                message=ASSET_SUCCESSFULLY_ASSIGNED,
                status=status.HTTP_201_CREATED,
            )
        else:
            return APIResponse(
                message=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
