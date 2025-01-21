import json

from django.forms import model_to_dict
from asset.models import (
    AssetLog,
    Location,
    BusinessUnit,
    Memory,
    AssetType,
    Asset,
)
from asset.signals.asset_previous_value_signal import asset_previous_value_signal
from employee.models.employee import Employee
from exceptions import NotFoundException, ValidationException
from user_auth.models import User
from messages import (
    ASSET_LOGS_NOT_FOUND,
    ASSET_LOG_FOUND,
    BAD_REQUEST_ERROR,
    NO_ASSET_LOGS_IN_TIMELINE,
)
from rest_framework import status
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from typing import Optional
from datetime import datetime
import urllib.parse
import sentry_sdk


class AssetLogService:
    @staticmethod
    def get_asset_logs(
        asset_uuid: str, recency: Optional[str] = None, timeline: Optional[str] = None
    ):
        asset_logs = AssetLog.objects.filter(asset_uuid=asset_uuid).order_by(
            "-timestamp"
        )

        if not asset_logs.exists():
            raise NotFoundException(
                {},
                message=ASSET_LOGS_NOT_FOUND,
                status=status.HTTP_404_NOT_FOUND,
            )

        response_data = {"asset_uuid": asset_uuid, "logs": []}

        if recency == "latest":
            latest_log = asset_logs.first()

            if latest_log:
                asset_log_json = json.loads(latest_log.asset_log)

                asset_log_json = AssetLogService.populate_asset_details(asset_log_json)

                log_data = {
                    "id": latest_log.id,
                    "timestamp": latest_log.timestamp,
                    "asset_log": asset_log_json,
                }
                response_data["logs"].append(log_data)
            else:
                raise NotFoundException(
                    {},
                    message=ASSET_LOGS_NOT_FOUND,
                    status=status.HTTP_404_NOT_FOUND,
                )

        elif timeline:
            try:
                decoded_timeline = urllib.parse.unquote(
                    timeline
                )  # Decode the URL-encoded datetime string
                timeline_datetime = datetime.strptime(
                    decoded_timeline, "%Y-%m-%dT%H:%M:%S.%fZ"
                )
                asset_logs_in_timeline = asset_logs.filter(timestamp=timeline_datetime)
            except ValueError:
                raise ValidationException(
                    {},
                    message=BAD_REQUEST_ERROR,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if asset_logs_in_timeline.exists():
                for log in asset_logs_in_timeline:
                    asset_log_json = json.loads(log.asset_log)

                    # Populate asset details
                    asset_log_json = AssetLogService.populate_asset_details(
                        asset_log_json
                    )

                    log_data = {
                        "id": log.id,
                        "timestamp": log.timestamp,
                        "asset_log": asset_log_json,
                    }
                    response_data["logs"].append(log_data)
            else:
                raise NotFoundException(
                    {},
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

        return response_data, ASSET_LOG_FOUND, status.HTTP_200_OK

    @staticmethod
    def get_actual_value(key: str, value: str):
        # Implement logic to retrieve actual values based on the key
        if key in ["location_id", "invoice_location_id"]:
            location_obj = Location.objects.filter(id=value).first()
            if location_obj:
                return {
                    "id": location_obj.id,
                    "location_name": location_obj.location_name,
                }
        elif key == "business_unit_id":
            business_unit_obj = BusinessUnit.objects.filter(id=value).first()
            if business_unit_obj:
                return {
                    "id": business_unit_obj.id,
                    "business_unit_name": business_unit_obj.business_unit_name,
                }
        elif key == "memory_id":
            memory_obj = Memory.objects.filter(id=value).first()
            if memory_obj:
                return {"id": memory_obj.id, "memory_space": memory_obj.memory_space}
        elif key == "asset_type_id":
            asset_type_obj = AssetType.objects.filter(id=value).first()
            if asset_type_obj:
                return {
                    "id": asset_type_obj.id,
                    "asset_type_name": asset_type_obj.asset_type_name,
                }
        elif key == "conceder_id":
            conceder_obj = User.objects.filter(id=value).first()
            if conceder_obj:
                return {
                    "id": conceder_obj.id,
                    "conceder_name": f"{conceder_obj.first_name} {conceder_obj.last_name}",
                }
        elif key == "custodian_id":
            custodian_obj = Employee.objects.filter(id=value).first()
            if custodian_obj:
                return {
                    "id": custodian_obj.id,
                    "employee_name": custodian_obj.employee_name,
                }
        elif key == "requester_id":
            requester_obj = User.objects.filter(id=value).first()
            if requester_obj:
                return {
                    "id": requester_obj.id,
                    "requester_name": f"{requester_obj.first_name} {requester_obj.last_name}",
                }
        else:
            return value  # Return the value unchanged if no special handling is needed

    @staticmethod
    def populate_asset_details(asset_log_json):
        location_id = asset_log_json.pop("location_id", None)
        if location_id:
            location_obj = Location.objects.filter(id=location_id).first()
            if location_obj:
                asset_log_json["location"] = {
                    "id": location_obj.id,
                    "location_name": location_obj.location_name,
                }

        business_unit_id = asset_log_json.pop("business_unit_id", None)
        if business_unit_id:
            business_unit_obj = BusinessUnit.objects.filter(id=business_unit_id).first()
            if business_unit_obj:
                asset_log_json["business_unit"] = {
                    "id": business_unit_obj.id,
                    "business_unit_name": business_unit_obj.business_unit_name,
                }

        memory_id = asset_log_json.pop("memory_id", None)
        if memory_id:
            memory_obj = Memory.objects.filter(id=memory_id).first()
            if memory_obj:
                asset_log_json["memory_space"] = {
                    "id": memory_obj.id,
                    "memory_space": memory_obj.memory_space,
                }

        asset_type_id = asset_log_json.pop("asset_type_id", None)
        if asset_type_id:
            asset_type_obj = AssetType.objects.filter(id=asset_type_id).first()
            if asset_type_obj:
                asset_log_json["asset_type"] = {
                    "id": asset_type_obj.id,
                    "asset_type_name": asset_type_obj.asset_type_name,
                }

        invoice_location_id = asset_log_json.pop("invoice_location_id", None)
        if invoice_location_id:
            location_obj = Location.objects.filter(id=invoice_location_id).first()
            if location_obj:
                asset_log_json["invoice_location"] = {
                    "id": location_obj.id,
                    "invoice_location_name": location_obj.location_name,
                }

        conceder_id = asset_log_json.pop("conceder_id", None)
        if conceder_id:
            conceder_obj = User.objects.filter(id=conceder_id).first()
            if conceder_obj:
                asset_log_json["conceder"] = {
                    "id": conceder_obj.id,
                    "conceder_name": f"{conceder_obj.first_name} {conceder_obj.last_name}",
                }

        custodian_id = asset_log_json.pop("custodian_id", None)
        if custodian_id:
            custodian_obj = Employee.objects.filter(id=custodian_id).first()
            if custodian_obj:
                asset_log_json["custodian"] = {
                    "id": custodian_obj.id,
                    "employee_name": custodian_obj.employee_name,
                }

        requester_id = asset_log_json.pop("requester_id", None)
        if requester_id:
            requester_obj = User.objects.filter(id=requester_id).first()
            if requester_obj:
                asset_log_json["requester"] = {
                    "id": requester_obj.id,
                    "requester_name": f"{requester_obj.first_name} {requester_obj.last_name}",
                }

        return asset_log_json


previous_instance = {}


@receiver(signal=asset_previous_value_signal, sender=Asset)
def store_previous_instance(sender, instance, **kwargs):
    if instance.pk:
        previous_instance[instance.pk] = model_to_dict(instance)


@receiver(post_save, sender=Asset)
def log_asset_changes(sender, instance, **kwargs):
    try:
        if instance.pk in previous_instance:
            old_instance = previous_instance[instance.pk]

            print(
                f'Outside Log Service: Old Log: {old_instance["is_deleted"]}, New Log: {instance.is_deleted}'
            )

            if old_instance["is_deleted"] != instance.is_deleted:
                print(
                    f'Inside Log Service: Old Log: {old_instance["is_deleted"]}, New Log: {instance.is_deleted}'
                )
                pass
            elif old_instance["asset_detail_status"] != instance.asset_detail_status:
                if instance.asset_detail_status not in [
                    "CREATED",
                    "UPDATED",
                    "UPDATE_REJECTED",
                ]:
                    return

            elif old_instance["assign_status"] != instance.assign_status:
                if instance.assign_status not in ["ASSIGNED", "UNASSIGNED", "REJECTED"]:
                    return

            else:
                return

            changes = {
                field: getattr(instance, field)
                for field in old_instance
                if field != "asset_uuid"
            }
            asset_log_data = json.dumps(changes, indent=4, sort_keys=True, default=str)

            # TODO - How about logging DELETE and RESTORE operations
            if changes:
                with transaction.atomic():
                    asset_log_entry = AssetLog.objects.create(
                        asset_uuid=instance,
                        asset_log=asset_log_data,
                    )
                    asset_log_entry.save()

    except Exception as e:
        print("Exception: ", str(e))
        sentry_sdk.capture_exception(e)

    finally:
        if instance.pk in previous_instance:
            del previous_instance[instance.pk]
