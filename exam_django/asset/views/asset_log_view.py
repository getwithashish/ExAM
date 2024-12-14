from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.service.asset_log_crud_service.asset_log_service import AssetLogService
from rest_framework.request import Request
from rest_framework import status

from messages import GLOBAL_500_EXCEPTION_ERROR
from exceptions import NotFoundException, ValidationException
from response import APIResponse


class AssetLogView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, asset_uuid: str):
        try:
            recency = request.query_params.get("recency")
            timeline = request.query_params.get("timeline")

            data, message, http_status = AssetLogService.get_asset_logs(
                asset_uuid, recency=recency, timeline=timeline
            )

            return APIResponse(data=data, message=message, status=http_status)

        except NotFoundException as nfe:
            return APIResponse(
                data=str(nfe),
                message=nfe.message,
                status=nfe.status,
            )

        except ValidationException as ve:
            return APIResponse(
                data=str(ve),
                message=ve.message,
                status=ve.status,
            )

        except Exception as e:
            return APIResponse(
                data=str(e),
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
