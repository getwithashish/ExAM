from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from asset.serializers import AssetLogSerializer
import json
from django.http import JsonResponse
from asset.models import AssetLog, Location, BusinessUnit, AssetType, User, Memory,Employee


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

            #  Search memory if it exists
            if "memory_id" in asset_log_json:
                memory_id = asset_log_json.pop(
                    "memory_id"
                )  # Remove location_id from the dictionary
                memory_obj = Memory.objects.filter(id=memory_id).first()
                if memory_obj:
                    asset_log_json["memory_space"] = memory_obj.memory_space

            #  Search asset type name if it exists
            if "asset_type_id" in asset_log_json:
                asset_type_id = asset_log_json.pop(
                    "asset_type_id"
                )  # Remove location_id from the dictionary
                asset_type_obj = AssetType.objects.filter(id=asset_type_id).first()
                if location_obj:
                    asset_log_json["asset_type"] = asset_type_obj.asset_type_name

             #  Search invoice location name if it exists
            if "invoice_location_id" in asset_log_json:
                invoice_location_id = asset_log_json.pop(
                    "invoice_location_id"
                )  # Remove location_invoice_id from the dictionary
                location_obj = Location.objects.filter(id=invoice_location_id).first()
                if location_obj:
                    asset_log_json["invoice_location"] = location_obj.location_name







             #  Search conceder name if it exists
            if 'conceder_id' in asset_log_json:
                conceder_id = asset_log_json.pop('conceder_id')  # Remove location_id from the dictionary
                conceder_obj = User.objects.filter(id=conceder_id).first()
                conceder_object = {}
                if conceder_obj:
                    conceder_object = {
                        "id": conceder_obj.id,
                        "full_name": conceder_obj.first_name +" " +conceder_obj.last_name
                    }
                    
                    
                    asset_log_json['conceder'] = conceder_object
            

             #  Search custodian name if it exists
            if 'custodian_id' in asset_log_json:
                custodian_id = asset_log_json.pop('custodian_id')  # Remove location_id from the dictionary
                custodian_obj = Employee.objects.filter(id=custodian_id).first()
                if custodian_obj:
                    asset_log_json['custodian name'] = custodian_obj.employee_name 


             #  Search requester name if it exists
            if 'requester_id' in asset_log_json:
                requester_id = asset_log_json.pop('requester_id')  # Remove requester_id from the dictionary
                requester_obj = User.objects.filter(id=requester_id).first()
                if requester_obj:
                    asset_log_json['rquester name'] = requester_obj.first_name +" " +requester_obj.last_name
            
           
                    

            log_data = {
                "id": log.id,
                "timestamp": log.timestamp,
                "asset_log": asset_log_json,
            }
            response_data["logs"].append(log_data)

        return JsonResponse(response_data, safe=False)
