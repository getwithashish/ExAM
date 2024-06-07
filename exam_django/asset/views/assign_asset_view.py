# assign_asset_view.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.serializers import AssignAssetSerializer
from messages import INVALID_ASSET_DATA
from exceptions import (
    NotAcceptableOperationException,
    NotFoundException,
    PermissionDeniedException,
    SerializerException,
)
from response import APIResponse
from asset.service.asset_assign_service.assign_asset_service import AssignAssetService


class AssignAssetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = AssignAssetSerializer(data=request.data)
            if serializer.is_valid():
                requester = request.user
                role = requester.user_scope

                employee_id = request.data.get("id")
                asset_uuid = request.data.get("asset_uuid")

                # Assign the asset using the appropriate service based on requester's role
                data, message, http_status = AssignAssetService.assign_asset(
                    role, asset_uuid, employee_id, requester
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

        except NotFoundException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

        except SerializerException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

        except NotAcceptableOperationException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

        except PermissionDeniedException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )
