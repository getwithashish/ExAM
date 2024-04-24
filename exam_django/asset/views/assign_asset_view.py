# assign_asset_view.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.serializers import AssignAssetSerializer
from response import APIResponse
from asset.service.asset_assign_service.assign_asset_service import AssignAssetService


class AssignAssetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AssignAssetSerializer(data=request.data)
        if serializer.is_valid():
            requester = request.user
            role = requester.user_scope

            employee_id = request.data.get("id")
            asset_uuid = request.data.get("asset_uuid")

            # Assign the asset using the appropriate service based on requester's role
            response = AssignAssetService.assign_asset(
                role, asset_uuid, employee_id, requester
            )

            return APIResponse(
                message=response['message'],  # Extracting the message
                status=response['status'],    # Extracting the status code
            )
        else:
            return APIResponse(
                message=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
