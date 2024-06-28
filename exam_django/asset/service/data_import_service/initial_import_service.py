import csv
import io
import pandas as pd
import zipfile
from datetime import datetime
from django.forms import ValidationError
from asset.models import Asset, AssetType, BusinessUnit, Employee, Location, Memory


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
            asset_id = row.get("ID", "")

            if asset_id in existing_asset_ids:
                skipped_assets_count += 1
                skipped_fields_assets.append(row)
                continue

            mandatory_fields = [
                "Category",
                "Asset Category",
                "Product Name",
                "Owner",
            ]
            if any(str(row.get(field, "")).strip() == "" for field in mandatory_fields):
                missing_fields_assets.append(row)
                continue

            
            date_of_purchase = row.get("Date Of Purchase", "")
            default_date = datetime.strptime("1960-01-01", "%Y-%m-%d").date()
            if pd.isna(date_of_purchase) or date_of_purchase == "":
                purchase_date = default_date
            else:
                try:
                    if isinstance(date_of_purchase, pd.Timestamp):
                        if pd.isna(date_of_purchase):
                            purchase_date = None
                        else:
                            date_of_purchase = date_of_purchase.strftime("%Y-%m-%d")
                            purchase_date = datetime.strptime(date_of_purchase, "%Y-%m-%d").date()
                    else:
                        purchase_date = datetime.strptime(date_of_purchase, "%Y-%m-%d").date()
                except ValueError:
                    purchase_date = None

            asset_type, _ = AssetType.objects.get_or_create(
                asset_type_name=row.get("Asset Category", "").strip()
            )
            business_unit, _ = BusinessUnit.objects.get_or_create(
                business_unit_name=str(
                    row.get("BU", "")
                ).strip()  # Ensure business_unit_name is handled as string
            )
            custodian, _ = Employee.objects.get_or_create(
                employee_name=row.get("Custodian", "").strip()
            )
            location, _ = Location.objects.get_or_create(
                location_name=str(row.get("Location", "")).strip()
            )
            invoice_location, _ = Location.objects.get_or_create(
                location_name=str(row.get("Invoice Location", "")).strip()
            )

            memory_space = row.get("Memory", "")
            if isinstance(memory_space, float) and pd.isna(memory_space):
                memory = None
            else:
                memory_space = str(
                    memory_space
                ).strip()  # Convert to string and strip whitespace

                if '.' in memory_space:
                # Convert float-like strings to float first, then to int
                    memory_space = int(float(memory_space))
                else:
                # Convert integer-like strings directly to int
                    memory_space = int(memory_space)

                if memory_space == "nan" or memory_space == "":
                    memory = None
                else:
                    try:
                        
                        
                        memory, _ = Memory.objects.get_or_create(
                            memory_space=memory_space
                        )
                    except ValueError:
                        print("memory type =" ,type(memory_space))
                        row["Error"] = "Invalid memory value"
                        missing_fields_assets.append(row)
                        continue

            warranty = row.get("Warranty", "")
            if isinstance(warranty, (int, float)):
                if pd.isna(warranty):
                    warranty = None
                else:
                    warranty = int(warranty)
            else:
                warranty = str(warranty).strip()
                if warranty == "Expired":
                    warranty = -1
                elif warranty == "":
                    warranty = None
                else:
                    try:
                        warranty = int(warranty)
                    except ValueError:
                        row["Error"] = "Invalid warranty value"
                        missing_fields_assets.append(row)
                        continue

            status = row.get("Status", "").strip()
            if status == "No Service":
                status = "UNREPAIRABLE"
            elif status == "In Service" and row.get("Custodian"):
                status = "IN USE"
            elif status == "In Service" and not row.get("Custodian"):
                status = "IN STORE"
            elif status == "Damaged":
                status = "DAMAGED"
            elif status == "Expired":
                status = "OUTDATED"
            else:
                status = "UNKNOWN"

            approval_status = row.get("Approval Status", "").strip()
            if approval_status == "Approved":
                asset_detail_status = "CREATED"
            elif approval_status == "Pending":
                asset_detail_status = "UPDATE PENDING"
            elif approval_status == "Rejected":
                asset_detail_status = "UPDATE REJECTED"
            else:
                asset_detail_status = "UNKNOWN"

            assign_status = "ASSIGNED" if row.get("Custodian") else "UNASSIGNED"

            asset = Asset(
                asset_id=asset_id,
                # version=str(row.get("Version", "")).strip(),  # Handle version as string
                asset_category=str(row.get("Category", "")).strip(),
                product_name=str(row.get("Product Name", "")).strip(),
                model_number=str(
                    row.get("Model Number", "")
                ).strip(),  # Ensure model_number is handled as string
                serial_number=str(row.get("Serial Number", "")).strip(),
                owner=str(row.get("Owner", "")).strip(),
                date_of_purchase=purchase_date,
                status=status,
                warranty_period=warranty,
                os=str(row.get("OS", "")).strip(),
                os_version=str(row.get("OS Version", "")).strip(),
                mobile_os=str(row.get("Mobile OS", "")).strip(),
                processor=str(row.get("Processor", "")).strip(),
                processor_gen=str(row.get("Generation", "")).strip(),
                storage=str(row.get("Storage", "")).strip(),
                configuration=str(row.get("Configuration", "")).strip(),
                accessories=str(row.get("Accessories", "")).strip(),
                notes=str(row.get("Notes", "")).strip(),
                asset_detail_status=asset_detail_status,
                assign_status=assign_status,
                approval_status_message=str(
                    row.get("approval_status_message", "")
                ).strip(),
                created_at=str(row.get("created_at", "")).strip(),
                updated_at=str(row.get("updated_at", "")).strip(),
                is_deleted=False,
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
    def generate_missing_fields_csv(missing_fields_assets):
        output = io.StringIO()
        csv_writer = csv.writer(output)

        if missing_fields_assets:
            header_row = missing_fields_assets[0].keys()
            csv_writer.writerow(header_row)

            for asset in missing_fields_assets:
                csv_writer.writerow(asset.values())

        return output

    @staticmethod
    def generate_missing_fields_xlsx(missing_fields_assets):
        if missing_fields_assets:
            df = pd.DataFrame(missing_fields_assets)
            output = io.BytesIO()
            df.to_excel(output, index=False)
            output.seek(0)
            return output
        else:
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
        with zipfile.ZipFile(zip_content, "w", zipfile.ZIP_DEFLATED, allowZip64=True) as zf:
            zf.writestr("skipped_fields.xlsx", xlsx_file_one.getvalue())
            zf.writestr("missing_fields.xlsx", xlsx_file_two.getvalue())

        zip_content.seek(0)
        return zip_content

