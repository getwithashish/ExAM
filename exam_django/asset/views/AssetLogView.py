from rest_framework.views import APIView
from django.http import JsonResponse
from asset.models import (
    AssetLog,
    Location,
    BusinessUnit,
    AssetType,
    User,
    Memory,
    Employee,
)
import json


# View to retrive the asset log details of a particular asset_uuid
class AssetLogView(APIView):
    def get(self, request, asset_uuid):
        try:
            asset_logs = AssetLog.objects.filter(asset_uuid=asset_uuid)
            if not asset_logs.exists():
                return JsonResponse(
                    {"message": "Assets not found for the provided UUID"}, status=404
                )

            response_data = {"asset_uuid": asset_uuid, "logs": []}
            for log in asset_logs:
                asset_log_json = json.loads(log.asset_log)

                # Search location name if it exists
                location_id = asset_log_json.pop("location_id", None)
                if location_id:
                    location_obj = Location.objects.filter(id=location_id).first()
                    if location_obj:
                        asset_log_json["location"] = {
                            "id": location_obj.id,
                            "location_name": location_obj.location_name,
                        }

                # Search business unit name if it exists
                business_unit_id = asset_log_json.pop("business_unit_id", None)
                if business_unit_id:
                    business_unit_obj = BusinessUnit.objects.filter(
                        id=business_unit_id
                    ).first()
                    if business_unit_obj:
                        asset_log_json["business_unit"] = {
                            "id": business_unit_obj.id,
                            "business_unit_name": business_unit_obj.business_unit_name,
                        }

                # Search memory if it exists
                memory_id = asset_log_json.pop("memory_id", None)
                if memory_id:
                    memory_obj = Memory.objects.filter(id=memory_id).first()
                    if memory_obj:
                        asset_log_json["memory_space"] = {
                            "id": memory_obj.id,
                            "memory_space": memory_obj.memory_space,
                        }

                # Search asset type name if it exists
                asset_type_id = asset_log_json.pop("asset_type_id", None)
                if asset_type_id:
                    asset_type_obj = AssetType.objects.filter(id=asset_type_id).first()
                    if asset_type_obj:
                        asset_log_json["asset_type"] = {
                            "id": asset_type_obj.id,
                            "asset_type_name": asset_type_obj.asset_type_name,
                        }

                # Search invoice location name if it exists
                invoice_location_id = asset_log_json.pop("invoice_location_id", None)
                if invoice_location_id:
                    location_obj = Location.objects.filter(
                        id=invoice_location_id
                    ).first()
                    if location_obj:
                        asset_log_json["invoice_location"] = {
                            "id": location_obj.id,
                            "invoice_location_name": location_obj.location_name,
                        }

                # Search conceder name if it exists
                conceder_id = asset_log_json.pop("conceder_id", None)
                if conceder_id:
                    conceder_obj = User.objects.filter(id=conceder_id).first()
                    if conceder_obj:
                        asset_log_json["conceder"] = {
                            "id": conceder_obj.id,
                            "conceder_name": f"{conceder_obj.first_name} {conceder_obj.last_name}",
                        }

                # Search custodian name if it exists
                custodian_id = asset_log_json.pop("custodian_id", None)
                if custodian_id:
                    custodian_obj = Employee.objects.filter(id=custodian_id).first()
                    if custodian_obj:
                        asset_log_json["custodian"] = {
                            "id": custodian_obj.id,
                            "employee_name": custodian_obj.employee_name,
                        }

                # Search requester name if it exists
                requester_id = asset_log_json.pop("requester_id", None)
                if requester_id:
                    requester_obj = User.objects.filter(id=requester_id).first()
                    if requester_obj:
                        asset_log_json["requester"] = {
                            "id": requester_obj.id,
                            "requester_name": f"{requester_obj.first_name} {requester_obj.last_name}",
                        }

                log_data = {
                    "id": log.id,
                    "timestamp": log.timestamp,
                    "asset_log": asset_log_json,
                }
                response_data["logs"].append(log_data)

            response_data["message"] = "Assets found"
            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse(
                {
                    "message": "An error occurred while processing the request",
                    "error": str(e),
                },
                status=500,
            )
