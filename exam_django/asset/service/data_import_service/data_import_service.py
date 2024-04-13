import csv
import io
import pandas as pd
from datetime import datetime
from django.forms import ValidationError
from asset.models import Asset, AssetType, BusinessUnit, Employee, Location, Memory

class AssetImportService:
    @staticmethod
    def parse_and_add_assets(file_content, user, file_type):
        if file_type == "csv":
            csv_reader = csv.DictReader(file_content.decode("utf-8").splitlines())
        elif file_type == "xlsx":
            # Read XLSX file using pandas library
            df = pd.read_excel(io.BytesIO(file_content))
            # Convert DataFrame to dictionary
            data = df.to_dict(orient='records')
            # Convert dictionary to list of dictionaries for consistency with CSV
            csv_reader = [dict(row) for row in data]
        else:
            raise ValueError("Invalid file type. Must be 'csv' or 'xlsx'.")

        existing_asset_ids = set(Asset.objects.values_list("asset_id", flat=True))
        existing_serial_numbers = set(Asset.objects.values_list("serial_number", flat=True))

        added_assets_count = 0
        skipped_assets_count = 0
        missing_fields_assets = []

        new_assets = []  # List to hold new assets for bulk creation

        for row in csv_reader:
            asset_id = row.get("asset_id", "")
            serial_number = row.get("serial_number", "")

            if asset_id in existing_asset_ids or serial_number in existing_serial_numbers:
                skipped_assets_count += 1
                continue

            mandatory_fields = ["asset_category", "asset_id", "version", "asset_type", "product_name", "serial_number", "model_number", "owner", "date_of_purchase", "warranty_period", "invoice_location", "business_unit"]
            if any(str(row.get(field, "")).strip() == "" for field in mandatory_fields):
                missing_fields_assets.append(row)
                continue

            try:
                purchase_date = datetime.strptime(row["date_of_purchase"], "%Y-%m-%d").date()
            except ValueError:
                raise ValidationError("Date of purchase has an invalid format. It must be in YYYY-MM-DD format.")

            asset_type, asset_type_created = AssetType.objects.get_or_create(asset_type_name=row["asset_type"])
            business_unit, business_unit_created = BusinessUnit.objects.get_or_create(business_unit_name=row["business_unit"])
            custodian = Employee.objects.filter(employee_name=row["custodian"]).first()
            location, location_created = Location.objects.get_or_create(location_name=row["location"])
            invoice_location, invoice_location_created = Location.objects.get_or_create(location_name=row["invoice_location"])
            memory, memory_created = Memory.objects.get_or_create(memory_space=row["memory"])

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
                asset_detail_status="CREATED",
                approval_status_message=row["approval_status_message"],
                created_at=row["created_at"],
                updated_at=row["updated_at"],
                is_deleted=row["is_deleted"],
                approved_by=user,
                requester_id=user.id,
                asset_type_id=asset_type.id if asset_type else None,
                business_unit_id=business_unit.id if business_unit else None,
                custodian_id=custodian.id if custodian else None,
                invoice_location_id=invoice_location.id if invoice_location else None,
                location_id=location.id if location else None,
                memory_id=memory.id if memory else None,
            )

            new_assets.append(asset)
            added_assets_count += 1

        Asset.objects.bulk_create(new_assets)

        return AssetImportService._prepare_import_summary(
            added_assets_count, skipped_assets_count, missing_fields_assets
        )

    @staticmethod
    def _prepare_import_summary(added_assets_count, skipped_assets_count, missing_fields_assets):
        if added_assets_count == 0:
            message = "No new data found. All files are duplicates."
        else:
            message = (
                f"{added_assets_count} new data added to Asset table successfully. "
                f"{skipped_assets_count} duplicate entries omitted."
            )

        return {
            "message": message,
            "added_assets_count": added_assets_count,
            "skipped_assets_count": skipped_assets_count,
            "missing_fields_assets": missing_fields_assets,
        }

    @staticmethod
    def generate_missing_fields_csv(missing_fields_assets):
        output = io.StringIO()
        csv_writer = csv.writer(output)

        if missing_fields_assets:
            header_row = missing_fields_assets[0].keys()
            csv_writer.writerow(header_row)

            for asset in missing_fields_assets:
                csv_writer.writerow(asset.values())

        return output.getvalue()
