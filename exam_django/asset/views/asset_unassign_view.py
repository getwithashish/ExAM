from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.serializers import AssignAssetSerializer
from asset.models import Asset
from exceptions import PermissionDeniedException, SerializerException
from messages import ASSET_NOT_FOUND, INVALID_ASSET_DATA
from response import APIResponse
from asset.service.asset_unassign_service.asset_unassign_service import UnassignAssetService


class UnassignAssetView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request):
        try:
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
                raise SerializerException(
                    serializer.errors, INVALID_ASSET_DATA, status.HTTP_400_BAD_REQUEST
                )

        except Asset.DoesNotExist:
            return APIResponse(
                message=ASSET_NOT_FOUND,
                status=status.HTTP_404_NOT_FOUND,
            )

        except SerializerException as e:
            return APIResponse(
                data=str(e),
                message=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        except PermissionDeniedException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )
