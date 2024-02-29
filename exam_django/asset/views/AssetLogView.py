from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from asset.serializers import AssetLogSerializer
import json
from django.http import JsonResponse
from asset.models import AssetLog, Location, BusinessUnit, AssetType, User, Memory


class AssetLogView(APIView):
    def get(self, request, asset_uuid):
        asset_logs = AssetLog.objects.filter(asset_uuid=asset_uuid)
        response_data = {"asset_uuid": asset_uuid, "logs": []}
        for log in asset_logs:
            asset_log_json = json.loads(log.asset_log)

            #  Search location name if it exists
            if "location_id" in asset_log_json:
                location_id = asset_log_json.pop(
                    "location_id"
                )  # Remove location_id from the dictionary
                location_obj = Location.objects.filter(id=location_id).first()
                if location_obj:
                    asset_log_json["location"] = location_obj.location_name

            # Search business unit name if it exists
            if "business_unit_id" in asset_log_json:
                business_unit_id = asset_log_json.pop(
                    "business_unit_id"
                )  # Remove business_unit_id from the dictionary
                business_unit_obj = BusinessUnit.objects.filter(
                    id=business_unit_id
                ).first()
                if business_unit_obj:
                    asset_log_json["business_unit"] = (
                        business_unit_obj.business_unit_name
                    )

            #  Search asset type name if it exists
            if "memory_id" in asset_log_json:
                memory_id = asset_log_json.pop(
                    "memory_id"
                )  # Remove location_id from the dictionary
                memory_obj = Memory.objects.filter(id=memory_id).first()
                if memory_obj:
                    asset_log_json["memory_space"] = memory_obj.memory_space

            #  Search memory name if it exists
            if "location_id" in asset_log_json:
                location_id = asset_log_json.pop(
                    "location_id"
                )  # Remove location_id from the dictionary
                location_obj = Location.objects.filter(id=location_id).first()
                if location_obj:
                    asset_log_json["location"] = location_obj.location_name

            #  #  Search location name if it exists
            # if 'conceder_id' in asset_log_json:
            #     conceder_id = asset_log_json.pop('conceder_id')  # Remove location_id from the dictionary
            #     conceder_obj = User.objects.filter(id=id).first()
            #     if conceder_obj:
            #         asset_log_json['conceder'] = conceder_obj.first_name + conceder_obj.last_name

            # Construct log data and append to response
            log_data = {
                "id": log.id,
                "timestamp": log.timestamp,
                "asset_log": asset_log_json,
            }
            response_data["logs"].append(log_data)

        return JsonResponse(response_data, safe=False)
