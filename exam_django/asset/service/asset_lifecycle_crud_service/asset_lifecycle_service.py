from rest_framework import status
from rest_framework.views import APIView
import json

import sentry_sdk
from employee.models import Employee
from user_auth.models import User

from asset.models import AssetLog, Location, BusinessUnit, Memory, AssetType
from response import APIResponse
from messages import ASSET_NOT_FOUND, ASSET_LOG_FOUND


class AssetLifeCycleService(APIView):
    @staticmethod
    def get_asset_logs(asset_uuid):
        try:
            asset_logs = AssetLog.objects.filter(asset_uuid=asset_uuid).order_by(
                "timestamp"
            )
            if not asset_logs.exists():
                return APIResponse(
                    data=[], message=ASSET_NOT_FOUND, status=status.HTTP_404_NOT_FOUND
                )

            response_data = {"asset_uuid": asset_uuid, "logs": []}
            previous_log_data = {}

            for log in asset_logs:
                current_log_data = json.loads(log.asset_log)

                if not isinstance(current_log_data, dict):
                    print(f"Invalid log data format: {current_log_data}")
                    sentry_sdk.capture_exception(
                        f"Invalid log data format: {current_log_data}"
                    )
                    continue

                operation, changes = AssetLifeCycleService.determine_operation(
                    previous_log_data=previous_log_data,
                    current_log_data=current_log_data,
                )

                if changes or not previous_log_data:
                    formatted_timestamp = log.timestamp.strftime("%B %d, %Y")
                    log_data = {
                        "id": log.id,
                        "timestamp": formatted_timestamp,
                        "operation": operation,
                        "changes": changes,
                    }
                    response_data["logs"].append(log_data)

                previous_log_data = current_log_data

            return APIResponse(
                data=response_data, message=ASSET_LOG_FOUND, status=status.HTTP_200_OK
            )

        except Exception as e:
            print("Exception: ", str(e))
            sentry_sdk.capture_exception(e)
            return APIResponse(
                data=[], message=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def determine_operation(previous_log_data, current_log_data):
        changes = {}
        operation = ""

        if previous_log_data and (
            previous_log_data.get("is_deleted") != current_log_data.get("is_deleted")
        ):
            operation = "DELETED" if current_log_data.get("is_deleted") else "RESTORED"
            changes = AssetLifeCycleService.detect_changes(
                previous_log_data, current_log_data
            )

        elif (
            previous_log_data
            and (current_log_data.get("assign_status") != "ASSIGN_PENDING")
            and (
                (
                    previous_log_data.get("assign_status")
                    != current_log_data.get("assign_status")
                    and current_log_data.get("assign_status") == "REJECTED"
                )
                or (
                    (
                        previous_log_data.get("assign_status") == "REJECTED"
                        and (
                            not previous_log_data.get("custodian")
                            and not current_log_data.get("custodian")
                            # TODO Need to test it in case of modifying the asset when assign status is in rejected
                        )
                    )
                    or (
                        previous_log_data.get("custodian")
                        and not current_log_data.get("custodian")
                    )
                )
            )
        ):
            if current_log_data.get("assign_status") == "REJECTED":
                operation = "DEALLOCATION REJECTED"
            else:
                operation = "DEALLOCATED"
            changes = {
                "custodian": {
                    "old_value": previous_log_data.get("custodian"),
                    "new_value": None,
                },
                "business_unit": {
                    "old_value": previous_log_data.get("business_unit"),
                    "new_value": current_log_data.get("business_unit"),
                },
                "status": {
                    "old_value": previous_log_data.get("status"),
                    "new_value": (
                        current_log_data.get("status")
                        if current_log_data.get("status")
                        != previous_log_data.get("status")
                        else "None"
                    ),
                },
            }

        elif (
            previous_log_data
            and (current_log_data.get("assign_status") != "ASSIGN_PENDING")
            and (
                previous_log_data.get("assign_status")
                != current_log_data.get("assign_status")
                or (
                    (
                        previous_log_data.get("assign_status") == "REJECTED"
                        and (
                            previous_log_data.get("custodian")
                            == current_log_data.get("custodian")
                        )
                    )
                    or (
                        previous_log_data.get("custodian")
                        != current_log_data.get("custodian")
                    )
                )
            )
        ):
            if current_log_data.get("assign_status") == "REJECTED":
                operation = "ALLOCATION REJECTED"
            else:
                operation = "ALLOCATED"
            old_status = previous_log_data.get("status")
            new_status = current_log_data.get("status")
            changes = {
                "custodian": {
                    "old_value": previous_log_data.get("custodian"),
                    "new_value": current_log_data.get("custodian"),
                },
                "business_unit": {
                    "old_value": previous_log_data.get("business_unit"),
                    "new_value": current_log_data.get("business_unit"),
                },
                "status": {
                    "old_value": old_status,
                    "new_value": (new_status if new_status != old_status else "None"),
                },
            }

        else:
            operation = current_log_data.get("asset_detail_status", "Unknown")
            if operation == "UPDATE_REJECTED":
                operation = "UPDATION REJECTED"

            changes = AssetLifeCycleService.detect_changes(
                previous_log_data, current_log_data
            )
        return operation, changes

    @staticmethod
    def detect_changes(previous_log, current_log):
        changes = {}
        for key, current_value in current_log.items():
            if key == "version":
                continue
            previous_value = previous_log.get(key)
            if previous_value != current_value:
                changes[key] = {
                    "old_value": AssetLifeCycleService.get_display_value(
                        key, previous_value
                    ),
                    "new_value": AssetLifeCycleService.get_display_value(
                        key, current_value
                    ),
                }
        return changes

    @staticmethod
    def get_display_value(field, value):
        if value is None:
            return "None"

        if not value or field not in [
            "location_id",
            "business_unit_id",
            "memory_id",
            "asset_type_id",
            "custodian_id",
            "requester_id",
            "invoice_location_id",
        ]:
            return value

        lookup = {
            "location_id": (Location, "location_name"),
            "business_unit_id": (BusinessUnit, "business_unit_name"),
            "memory_id": (Memory, "memory_space"),
            "asset_type_id": (AssetType, "asset_type_name"),
            "custodian_id": (Employee, "employee_name"),
            "requester_id": (User, "username"),
            "invoice_location_id": (Location, "location_name"),
        }

        model, field_name = lookup[field]
        try:
            return getattr(model.objects.get(id=value), field_name)
        except model.DoesNotExist:
            return "Unknown"
