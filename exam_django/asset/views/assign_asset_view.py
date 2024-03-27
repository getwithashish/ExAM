from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.serializers import AssignAssetSerializer
from response import APIResponse
from messages import ASSET_NOT_FOUND
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
        serializer = AssignAssetSerializer(data=request.data)
        if serializer.is_valid():
            requester = request.user
            role = requester.user_scope

            employee_id = request.data.get("id")
            asset_uuid = request.data.get("asset_uuid")

            # Assign the asset using the appropriate service based on requester's role
            message = AssignAssetService.assign_asset(
                role, asset_uuid, employee_id, requester
            )

            return APIResponse(
                message=message,
                status=status.HTTP_201_CREATED,
            )
        else:
            return APIResponse(
                message=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
