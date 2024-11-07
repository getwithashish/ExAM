import base64
from typing import List
from datetime import datetime
from rest_framework import status

from asset.models import Asset, AssetType, BusinessUnit, Employee, Location, Memory
from asset.utils.archive_file_generator import ArchiveFileGenerator
from messages import (
    IMPORT_OPERATION_FULL_SUCCESSFUL,
    IMPORT_OPERATION_PARTIAL_SUCCESSFUL,
    NO_ASSETS_IMPORTED,
)


class AssetImportService:
    @staticmethod
    def parse_and_add_assets(file_content, user, file_format_handler):
        csv_reader = file_format_handler.parse_to_csv(file_content)

        asset_detail_status = "CREATE_PENDING"
        approved_by = None
        if user.user_scope == "MANAGER":
            asset_detail_status = "CREATED"
            approved_by = user

        existing_asset_ids = set(Asset.objects.values_list("asset_id", flat=True))
        existing_serial_numbers = set(
            Asset.objects.values_list("serial_number", flat=True)
        )

        added_assets_count = 0
        skipped_assets = []
        missing_fields_assets = []
        invalid_fields_assets = []

        new_assets = []

        for row in csv_reader:
            try:
                asset_id = row.get("asset_id", "")
                serial_number = row.get("serial_number", "")

                if (
                    asset_id in existing_asset_ids
                    or serial_number in existing_serial_numbers
                ):
                    skipped_assets.append(row)
                    continue

                mandatory_fields = [
                    "asset_category",
                    "asset_id",
                    "version",
                    "asset_type",
                    "product_name",
                    "serial_number",
                    "model_number",
                    "owner",
                    "date_of_purchase",
                    "warranty_period",
                    "invoice_location",
                    "business_unit",
                ]

                if any(
                    str(row.get(field, "")).strip() == "" for field in mandatory_fields
                ):
                    missing_fields_assets.append(row)
                    continue

                purchase_date = datetime.strptime(
                    row["date_of_purchase"], "%Y-%m-%d"
                ).date()

                asset_type, _ = AssetType.objects.get_or_create(
                    asset_type_name=row["asset_type"]
                )
                business_unit, _ = BusinessUnit.objects.get_or_create(
                    business_unit_name=row["business_unit"]
                )
                custodian = Employee.objects.filter(
                    employee_name=row["custodian"]
                ).first()
                location, _ = Location.objects.get_or_create(
                    location_name=row["location"]
                )
                invoice_location, _ = Location.objects.get_or_create(
                    location_name=row["invoice_location"]
                )
                memory, _ = Memory.objects.get_or_create(memory_space=row["memory"])

                asset = Asset(
                    asset_id=asset_id,
                    version=row["version"],
                    asset_category=row["asset_category"],
                    product_name=row["product_name"],
                    model_number=row["model_number"],
                    serial_number=serial_number,
                    owner=row["owner"],
                    date_of_purchase=purchase_date,
                    status=row["status"],
                    warranty_period=row["warranty_period"],
                    os=row["os"],
                    os_version=row["os_version"],
                    mobile_os=row["mobile_os"],
                    processor=row["processor"],
                    processor_gen=row["processor_gen"],
                    storage=row["storage"],
                    configuration=row["configuration"],
                    accessories=row["accessories"],
                    notes=row["notes"],
                    asset_detail_status=asset_detail_status,
                    approval_status_message=row["approval_status_message"],
                    created_at=row["created_at"],
                    updated_at=row["updated_at"],
                    is_deleted=row["is_deleted"],
                    approved_by=approved_by,
                    requester_id=user.id,
                    asset_type_id=asset_type.id if asset_type else None,
                    business_unit_id=business_unit.id if business_unit else None,
                    custodian_id=custodian.id if custodian else None,
                    invoice_location_id=(
                        invoice_location.id if invoice_location else None
                    ),
                    location_id=location.id if location else None,
                    memory_id=memory.id if memory else None,
                )

                new_assets.append(asset)
                added_assets_count += 1

            except ValueError:
                invalid_fields_assets.append(row)

            except Exception:
                invalid_fields_assets.append(row)

        Asset.objects.bulk_create(new_assets)

        return AssetImportService._prepare_import_summary(
            added_assets_count,
            skipped_assets,
            missing_fields_assets,
            invalid_fields_assets,
        )

    @staticmethod
    def _prepare_import_summary(
        added_assets_count,
        skipped_assets: List,
        missing_fields_assets,
        invalid_fields_assets,
    ):

        return {
            "imported_assets_count": added_assets_count,
            "skipped_assets_count": len(skipped_assets),
            "missing_fields_assets_count": len(missing_fields_assets),
            "invalid_fields_assets_count": len(invalid_fields_assets),
            "invalid_fields_assets": invalid_fields_assets,
            "skipped_assets": skipped_assets,
            "missing_fields_assets": missing_fields_assets,
        }

    @staticmethod
    def create_import_report(result, file_type, file_format_handler):
        keys = [
            "imported_assets_count",
            "skipped_assets_count",
            "missing_fields_assets_count",
            "invalid_fields_assets_count",
        ]
        import_summary = {key: result[key] for key in keys}
        data = {"import_summary": import_summary}

        if (
            result["skipped_assets_count"]
            + result["missing_fields_assets_count"]
            + result["invalid_fields_assets_count"]
        ) > 0:

            skipped_fields_data = file_format_handler.generate_from_list(
                result["skipped_assets"]
            )
            missing_fields_data = file_format_handler.generate_from_list(
                result["missing_fields_assets"]
            )
            invalid_fields_data = file_format_handler.generate_from_list(
                result["invalid_fields_assets"]
            )

            data_to_be_returned = ArchiveFileGenerator.generate_zip(
                file_type=file_type,
                skipped_fields=skipped_fields_data,
                missing_fields=missing_fields_data,
                invalid_fields=invalid_fields_data,
            )

            if result["imported_assets_count"] == 0:
                message = NO_ASSETS_IMPORTED
                http_status = status.HTTP_200_OK
            else:
                message = IMPORT_OPERATION_PARTIAL_SUCCESSFUL
                http_status = status.HTTP_206_PARTIAL_CONTENT

            data["encoded_zip"] = base64.b64encode(
                data_to_be_returned.getvalue()
            ).decode("utf-8")

        else:
            message = IMPORT_OPERATION_FULL_SUCCESSFUL
            http_status = status.HTTP_202_ACCEPTED

        return data, message, http_status
