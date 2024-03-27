from rest_framework.views import APIView
from django.http import JsonResponse
from asset.service.asset_log_crud_service.asset_log_service import AssetLogService


class AssetLogView(APIView):
    def get(self, request, asset_uuid):
        return AssetLogService.get_asset_logs(asset_uuid)
