from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from django.db.models import F
from user_auth.models import User
 
from asset.models import AssetLog, Location, BusinessUnit, Memory, AssetType, Employee
from response import APIResponse
from messages import ASSET_NOT_FOUND, ASSET_LOG_FOUND
 
class AssetLifeCycleService(APIView):
    @staticmethod
    def get_asset_logs(asset_uuid):
        try:
            asset_logs = AssetLog.objects.filter(asset_uuid=asset_uuid).order_by('timestamp')
            if not asset_logs.exists():
                return APIResponse(data=[], message=ASSET_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)
 
            response_data = {"asset_uuid": asset_uuid, "logs": []}
            previous_log_data = {}
 
            for log in asset_logs:
                current_log_data = json.loads(log.asset_log)
               
                # Check if current_log_data is a dictionary
                if isinstance(current_log_data, dict):
                    # Detect ASSIGNMENT operation only if the custodian_id has changed
                    if previous_log_data and previous_log_data.get("custodian_id") != current_log_data.get("custodian_id"):
                        operation = "ASSIGNMENT"
                        custodian_name = AssetLifeCycleService.get_display_value("custodian_id", current_log_data.get("custodian_id"))
                        # old_status = "UNASSIGNED"
                        # new_status = current_log_data.get("assign_status")
                        old_status = previous_log_data.get("status")
                        new_status = current_log_data.get("status")
                        changes = {
                            "custodian": {"old_value": previous_log_data.get("custodian_id"), "new_value": custodian_name},
                            "status": {"old_value": old_status, "new_value": new_status}
                        }
                    else:
                        operation = current_log_data.get("asset_detail_status", "Unknown")
                        changes = AssetLifeCycleService.detect_changes(previous_log_data, current_log_data)
 
                    if changes or not previous_log_data:
                        formatted_timestamp = log.timestamp.strftime("%B %d, %Y")
                        log_data = {
                            "id": log.id,
                            "timestamp": formatted_timestamp,
                            "operation": operation,
                            "changes": changes
                        }
                        response_data["logs"].append(log_data)
 
                    previous_log_data = current_log_data
                else:
                    # Handle the case where current_log_data is not a dictionary
                    print(f"Invalid log data format: {current_log_data}")
 
            return APIResponse(data=response_data, message=ASSET_LOG_FOUND, status=status.HTTP_200_OK)
 
        except Exception as e:
            return APIResponse(data=[], message=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
    @staticmethod
    def detect_changes(previous_log, current_log):
        changes = {}
        for key, current_value in current_log.items():
            previous_value = previous_log.get(key)
            if previous_value != current_value:
                changes[key] = {
                    "old_value": AssetLifeCycleService.get_display_value(key, previous_value),
                    "new_value": AssetLifeCycleService.get_display_value(key, current_value)
                }
        return changes
 
    @staticmethod
    def get_display_value(field, value):
        if value is None:
            return "None"  # For initial creation
 
        if not value or field not in ['location_id', 'business_unit_id', 'memory_id', 'asset_type_id', 'custodian_id', 'requester_id', 'invoice_location_id']:
            return value
 
        lookup = {
            'location_id': (Location, 'location_name'),
            'business_unit_id': (BusinessUnit, 'business_unit_name'),
            'memory_id': (Memory, 'memory_space'),
            'asset_type_id': (AssetType, 'asset_type_name'),
            'custodian_id': (Employee, 'employee_name'),
            'requester_id': (User, 'username'),
            'invoice_location_id': (Location, 'location_name'),
        }
 
        model, field_name = lookup[field]
        try:
            return getattr(model.objects.get(id=value), field_name)
        except model.DoesNotExist:
            return "Unknown"
 