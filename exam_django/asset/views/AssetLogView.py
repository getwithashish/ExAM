from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from asset.models import AssetLog
from asset.serializers import AssetLogSerializer
import json
from django.http import JsonResponse
from asset.models import AssetLog
import json
from django.http import JsonResponse
from asset.models import AssetLog

#Class based view to get all the asset logs from asset table for a given asset_uuid 
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
