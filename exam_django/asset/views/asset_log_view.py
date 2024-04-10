from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.service.asset_log_crud_service.asset_log_service import AssetLogService
from rest_framework.request import Request
from typing import Optional

class AssetLogView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, asset_uuid: str):
        recency = request.query_params.get('recency')
        timeline = request.query_params.get('timeline')

        return AssetLogService.get_asset_logs(asset_uuid, recency=recency, timeline=timeline)
