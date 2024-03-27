from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.models import Asset, Employee
from asset.serializers import AssignAssetSerializer
from rest_framework.renderers import JSONRenderer
from notification.service.EmailService import EmailService
from response import APIResponse
from messages import (
    ASSET_NOT_FOUND,
    EMPLOYEE_NOT_FOUND_ERROR,
    STATUS_EXPIRED_OR_DISPOSED,
)
from asset.service.asset_assign_crud_service.assign_asset_service import (
    AssignAssetService,
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

            employee_id = request.data.get("id")

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
                    message=STATUS_EXPIRED_OR_DISPOSED,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Assign the asset using the appropriate service based on requester's role
            message = AssignAssetService.assign_asset(
                role, asset, employee_id, requester
            )

            # Serialize the assigned asset using the custom serializer
            assigned_asset_serializer = AssignAssetSerializer(asset)

            json_string = (
                JSONRenderer().render(assigned_asset_serializer.data).decode("utf-8")
            )
            email_service.send_email(
                message,
                "Serializer Data: {}".format(json_string),
                [
                    "astg7542@gmail.com",
                    "acj88178@gmail.com",
                    "asimapalexperion23@gmail.com",
                    "aidrin.varghese@experionglobal.com",
                    "pavithraexperion@gmail.com",
                ],
            )

            return APIResponse(
                data=assigned_asset_serializer.data,
                message=message,
                status=status.HTTP_201_CREATED,
            )
        else:
            return APIResponse(
                message=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
