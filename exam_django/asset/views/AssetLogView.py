from rest_framework.views import APIView
from django.http import JsonResponse
import json
from asset.models import AssetLog


class AssetLogView(APIView):
    def get(self, request, asset_uuid):
        asset_logs = AssetLog.objects.filter(asset_uuid=asset_uuid)
        response_data = {"asset_uuid": asset_uuid, "logs": []}
        for log in asset_logs:
            asset_log_json = json.loads(log.asset_log)
            log_data = {
                "id": log.id,
                "timestamp": log.timestamp,
                "asset_log": asset_log_json,
            }
            response_data["logs"].append(log_data)
        return JsonResponse(response_data, safe=False)
