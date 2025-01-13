import csv
import io
import pandas as pd
import zipfile
from datetime import datetime
from asset.models import (
    Asset,
    AssetType,
    BusinessUnit,
    Location,
    Memory,
    AssetLog,
)
from django.forms import model_to_dict
import json

from employee.models import Employee


def clean_field(value):
    if pd.isna(value) or value == "nan" or str(value).strip() == "":
        return None
    return str(value).strip()


def create_asset_logs(assets):
    for asset in assets:
        changes = {
            field: getattr(asset, field)
            for field in model_to_dict(asset)
            if field != "asset_uuid"
        }
        asset_log_data = json.dumps(changes, indent=4, sort_keys=True, default=str)
        AssetLog.objects.create(
            asset_uuid=asset,
            asset_log=asset_log_data,
        )


class AssetImportService:
    @staticmethod
    def parse_and_add_assets(file_content, user, file_type):
        if file_type == "csv":
            csv_reader = csv.DictReader(file_content.decode("utf-8").splitlines())
        elif file_type == "xlsx":
            df = pd.read_excel(io.BytesIO(file_content))
            data = df.to_dict(orient="records")
            csv_reader = [dict(row) for row in data]
        else:
            raise ValueError("Invalid file type. Must be 'csv' or 'xlsx'.")

        existing_asset_ids = set(Asset.objects.values_list("asset_id", flat=True))

        added_assets_count = 0
        skipped_assets_count = 0
        skipped_fields_assets = []
        missing_fields_assets = []

        new_assets = []

        for row in csv_reader:
            asset_id = clean_field(row.get("ID"))

            if asset_id in existing_asset_ids:
                skipped_assets_count += 1
                skipped_fields_assets.append(row)
                continue

            mandatory_fields = ["Category", "Asset Category", "Product Name", "Owner"]
            if any(clean_field(row.get(field)) is None for field in mandatory_fields):
                missing_fields_assets.append(row)
                continue

            date_of_purchase = row.get("Date Of Purchase")

            # default date.
            default_date = datetime.strptime("2010-08-09", "%Y-%m-%d").date()
            if pd.isna(date_of_purchase) or date_of_purchase == "":
                purchase_date = default_date
            else:
                try:
                    if isinstance(date_of_purchase, pd.Timestamp):
                        purchase_date = (
                            date_of_purchase.date()
                            if not pd.isna(date_of_purchase)
                            else None
                        )
                    else:
                        purchase_date = datetime.strptime(
                            date_of_purchase, "%m/%d/%Y"
                        ).date()
                except ValueError:
                    purchase_date = None

            asset_type = clean_field(row["Asset Category"])
            if asset_type is not None:
                asset_type, _ = AssetType.objects.get_or_create(
                    asset_type_name=asset_type
                )

            business_unit = clean_field(row["BU"])
            if business_unit is not None:
                business_unit, _ = BusinessUnit.objects.get_or_create(
                    business_unit_name=business_unit
                )

            location = clean_field(row["Location"])
            if location is not None:
                location, _ = Location.objects.get_or_create(location_name=location)

            custodian, _ = Employee.objects.get_or_create(
                employee_name=clean_field(row.get("Custodian"))
            )

            invoice_location = clean_field(row["Invoice Location"])
            if invoice_location is not None:
                invoice_location, _ = Location.objects.get_or_create(
                    location_name=invoice_location
                )

            memory = clean_field(row["Memory"])
            if memory is not None:
                memory, _ = Memory.objects.get_or_create(
                    memory_space=int(float(memory))
                )

            # memory_space = row.get("Memory")
            # if pd.isna(memory_space) or memory_space == "" or memory_space == "nan":
            #     memory = None
            # else:
            #     try:
            #         memory_space = int(float(str(memory_space).strip()))
            #         memory, _ = Memory.objects.get_or_create(memory_space=memory_space)
            #     except ValueError:
            #         row["Error"] = "Invalid memory value"
            #         missing_fields_assets.append(row)
            #         continue

            try:
                warranty = row.get("Warranty")
                if pd.isna(warranty) or str(warranty).strip() == "":
                    warranty = None
                elif isinstance(warranty, (int, float)):
                    warranty = int(warranty)
                else:
                    warranty = str(warranty).strip()
                    if warranty == "12" or warranty == "1 Year Warranty":
                        warranty = 12
                    elif warranty == "36" or warranty == "3 Year Warranty":
                        warranty = 36
                    elif warranty == "48" or warranty == "4 Year Warranty":
                        warranty = 48
                    elif warranty == "-2" or warranty.lower() == "under warranty":
                        warranty = 0
                    elif warranty == "Expired":
                        warranty = -1
                    else:
                        raise ValueError(f"Unexpected warranty value: {warranty}")

            except ValueError as e:
                print(e)
                missing_fields_assets.append(row)
                continue

            approval_status = clean_field(row.get("Approval Status"))
            if approval_status == "Approved":
                asset_detail_status = "CREATED"
            elif approval_status == "Pending":
                asset_detail_status = "UPDATE_PENDING"
            elif approval_status == "Rejected":
                asset_detail_status = "UPDATE_REJECTED"
            else:
                asset_detail_status = "CREATED"

            assign_status = (
                "UNASSIGNED"
                if not row.get("Custodian")
                or (
                    row.get("Custodian") == "Experion SFM"
                    and (
                        row.get("Asset Category") == "Laptop"
                        or row.get("BU") == "STOCK"
                    )
                )
                else "ASSIGNED"
            )

            if assign_status == "UNASSIGNED":
                custodian = None

            status = clean_field(row.get("Status"))
            if status == "No Service":
                status = "SCRAP"
            elif status == "In Service" and assign_status == "ASSIGNED":
                status = "USE"
            elif status == "In Service" and assign_status == "UNASSIGNED":
                status = "STOCK"
            elif status == "Damaged":
                status = "DAMAGED"
            elif status == "Expired":
                status = "OUTDATED"
            elif status == "Repair":
                status = "REPAIR"
            else:
                status = "UNKNOWN"

            is_deleted = False
            if status == "SCRAP":
                is_deleted = True

            asset = Asset(
                asset_id=asset_id,
                asset_category=clean_field(row.get("Category")),
                product_name=clean_field(row.get("Product Name")),
                model_number=clean_field(row.get("Model Number")),
                serial_number=clean_field(row.get("Serial Number")),
                owner=clean_field(row.get("Owner")),
                date_of_purchase=purchase_date,
                status=status,
                warranty_period=warranty,
                os=clean_field(row.get("OS")),
                os_version=clean_field(row.get("OS Version")),
                mobile_os=clean_field(row.get("Mobile OS")),
                processor=clean_field(row.get("Processor")),
                processor_gen=clean_field(row.get("Generation")),
                storage=clean_field(row.get("Storage")),
                configuration=clean_field(row.get("Configuration")),
                accessories=clean_field(row.get("Accessories")),
                notes=clean_field(row.get("Notes")),
                asset_detail_status=asset_detail_status,
                assign_status=assign_status,
                approval_status_message=clean_field(row.get("approval_status_message")),
                created_at=clean_field(row.get("created_at")),
                updated_at=clean_field(row.get("updated_at")),
                is_deleted=is_deleted,
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

        created_assets = Asset.objects.bulk_create(new_assets)
        create_asset_logs(created_assets)

        return AssetImportService._prepare_import_summary(
            added_assets_count,
            skipped_assets_count,
            skipped_fields_assets,
            missing_fields_assets,
        )

    @staticmethod
    def _prepare_import_summary(
        added_assets_count,
        skipped_assets_count,
        skipped_fields_assets,
        missing_fields_assets,
    ):
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
            "skipped_fields_assets": skipped_fields_assets,
            "missing_fields_assets": missing_fields_assets,
        }

    @staticmethod
    def generate_assets_csv(assets):
        output = io.StringIO()
        csv_writer = csv.writer(output)

        if assets:
            header_row = assets[0].keys()
            csv_writer.writerow(header_row)

            for asset in assets:
                csv_writer.writerow(asset.values())

        return output

    @staticmethod
    def generate_assets_xlsx(assets):
        if assets:
            df = pd.DataFrame(assets)
            output = io.BytesIO()
            df.to_excel(output, index=False)
            output.seek(0)
            # return output.getvalue()
            return output
        else:
            # return None
            return io.BytesIO()

    @staticmethod
    def generate_zip_file_csv(csv_file_one, csv_file_two):
        zip_content = io.BytesIO()
        with zipfile.ZipFile(zip_content, "w") as zf:
            zf.writestr("skipped_fields.csv", csv_file_one.getvalue())
            zf.writestr("missing_fields.csv", csv_file_two.getvalue())

        zip_content.seek(0)
        return zip_content

    @staticmethod
    def generate_zip_file_xlsx(xlsx_file_one, xlsx_file_two):
        zip_content = io.BytesIO()
        with zipfile.ZipFile(zip_content, "w") as zf:
            zf.writestr("skipped_fields.xlsx", xlsx_file_one.getvalue())
            zf.writestr("missing_fields.xlsx", xlsx_file_two.getvalue())

        zip_content.seek(0)
        return zip_content
