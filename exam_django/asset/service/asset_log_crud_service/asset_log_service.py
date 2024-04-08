import json
from asset.models import AssetLog, Location, BusinessUnit, Memory, AssetType, Employee, Asset
from user_auth.models import User
from response import APIResponse
from messages import ASSET_NOT_FOUND, ASSET_LOG_FOUND, NO_ASSET_LOGS_IN_TIMELINE
from rest_framework import status
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import transaction
from rest_framework.request import Request
from typing import Optional
from datetime import datetime
import urllib.parse

class AssetLogService:
    @staticmethod
    def get_asset_logs(asset_uuid: str, recency: Optional[str] = None, timeline: Optional[str] = None) -> APIResponse:
        try:
            asset_logs = AssetLog.objects.filter(asset_uuid=asset_uuid).order_by('-timestamp')

            if not asset_logs.exists():
                return APIResponse(
                    data=[],
                    message=ASSET_NOT_FOUND,
                    status=status.HTTP_404_NOT_FOUND,
                )

            response_data = {"asset_uuid": asset_uuid, "logs": []}

            if recency == "latest":
                latest_log = asset_logs.first()
                second_latest_log = asset_logs[1] if len(asset_logs) > 1 else None

                if latest_log and second_latest_log:
                    latest_log_data = json.loads(latest_log.asset_log)
                    second_latest_log_data = json.loads(second_latest_log.asset_log)

                    changes = {}
                    for key, value in latest_log_data.items():
                        if key in second_latest_log_data and second_latest_log_data[key] != value:
                            # Fetch actual values instead of IDs if available
                            value = AssetLogService.get_actual_value(key, value)
                            changes[key] = value

                    if changes:
                        log_data = {
                            "id": latest_log.id,
                            "timestamp": latest_log.timestamp,
                            "asset_log": changes,
                        }
                        response_data["logs"].append(log_data)
                else:
                    return APIResponse(
                        data=[],
                        message=ASSET_NOT_FOUND,
                        status=status.HTTP_404_NOT_FOUND,
                    )

            elif timeline:
                try:
                    decoded_timeline = urllib.parse.unquote(timeline)  # Decode the URL-encoded datetime string
                    timeline_datetime = datetime.strptime(decoded_timeline, "%Y-%m-%dT%H:%M:%S.%fZ")
                    asset_logs_in_timeline = asset_logs.filter(timestamp=timeline_datetime)
                except ValueError:
                    return APIResponse(
                        data=[],
                        message="Invalid isoformat string",
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if asset_logs_in_timeline.exists():
                    for log in asset_logs_in_timeline:
                        asset_log_json = json.loads(log.asset_log)

                        # Populate asset details
                        asset_log_json = AssetLogService.populate_asset_details(asset_log_json)

                        log_data = {
                            "id": log.id,
                            "timestamp": log.timestamp,
                            "asset_log": asset_log_json,
                        }
                        response_data["logs"].append(log_data)
                else:
                    return APIResponse(
                        data=[],
                        message=NO_ASSET_LOGS_IN_TIMELINE,
                        status=status.HTTP_404_NOT_FOUND,
                    )

            else:  # For other recency values or if recency is not provided
                for log in asset_logs:
                    asset_log_json = json.loads(log.asset_log)

                    # Populate asset details
                    asset_log_json = AssetLogService.populate_asset_details(asset_log_json)

                    log_data = {
                        "id": log.id,
                        "timestamp": log.timestamp,
                        "asset_log": asset_log_json,
                    }
                    response_data["logs"].append(log_data)

            return APIResponse(
                data=response_data,
                message=ASSET_LOG_FOUND,
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return APIResponse(
                data=[],
                message=str(e),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def get_actual_value(key: str, value: str):
        # Implement logic to retrieve actual values based on the key
        if key in ["location_id", "invoice_location_id"]:
            location_obj = Location.objects.filter(id=value).first()
            if location_obj:
                return {"id": location_obj.id, "location_name": location_obj.location_name}
        elif key == "business_unit_id":
            business_unit_obj = BusinessUnit.objects.filter(id=value).first()
            if business_unit_obj:
                return {"id": business_unit_obj.id, "business_unit_name": business_unit_obj.business_unit_name}
        elif key == "memory_id":
            memory_obj = Memory.objects.filter(id=value).first()
            if memory_obj:
                return {"id": memory_obj.id, "memory_space": memory_obj.memory_space}
        elif key == "asset_type_id":
            asset_type_obj = AssetType.objects.filter(id=value).first()
            if asset_type_obj:
                return {"id": asset_type_obj.id, "asset_type_name": asset_type_obj.asset_type_name}
        elif key == "conceder_id":
            conceder_obj = User.objects.filter(id=value).first()
            if conceder_obj:
                return {"id": conceder_obj.id, "conceder_name": f"{conceder_obj.first_name} {conceder_obj.last_name}"}
        elif key == "custodian_id":
            custodian_obj = Employee.objects.filter(id=value).first()
            if custodian_obj:
                return {"id": custodian_obj.id, "employee_name": custodian_obj.employee_name}
        elif key == "requester_id":
            requester_obj = User.objects.filter(id=value).first()
            if requester_obj:
                return {"id": requester_obj.id, "requester_name": f"{requester_obj.first_name} {requester_obj.last_name}"}
        else:
            return value  # Return the value unchanged if no special handling is needed

    @staticmethod
    def populate_asset_details(asset_log_json):
        # Populate asset details
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

        return asset_log_json

@receiver(pre_save, sender=Asset)
def log_asset_changes(sender, instance, **kwargs):
    old_instance = Asset.objects.filter(pk=instance.pk).values().first()
    if (
        old_instance
        or instance.asset_detail_status == "UPDATED"
        or instance.asset_detail_status == "ASSIGNED"
        or instance.asset_detail_status == "UNASSIGNED"
    ):
        changes = {
            field: getattr(instance, field)
            for field in old_instance
            if field != "asset_uuid"
        }
        asset_log_data = json.dumps(changes, indent=4, sort_keys=True, default=str)

        if changes:
            with transaction.atomic():
                asset_instance = Asset.objects.select_for_update().get(pk=instance.pk)
                asset_log_entry = AssetLog.objects.create(
                    asset_uuid=asset_instance,
                    asset_log=asset_log_data,
                )
                asset_log_entry.save()
