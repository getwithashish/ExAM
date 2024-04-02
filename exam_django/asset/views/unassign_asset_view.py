from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.serializers import AssignAssetSerializer
from response import APIResponse
from asset.service.unassign_service.unassign_service import UnassignAssetService


class UnassignAssetView(APIView):
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

            asset_uuid = request.data.get("asset_uuid")
            print("asset_uuid", request.data)

            # Assign the asset using the appropriate service based on requester's role
            data, message, http_status = UnassignAssetService.unassign_asset(
                role, asset_uuid, requester
            )

            return APIResponse(
                data=data,
                message=message,
                status=http_status,
            )
        else:
            return APIResponse(
                message=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
