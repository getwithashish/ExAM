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
        # existing_serial_numbers = set(
        #     Asset.objects.values_list("serial_number", flat=True)
        # )

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

            try:
                purchase_date = datetime.strptime(
                    row["Date Of Purchase"], "%Y-%m-%d"
                ).date()
            except ValueError:
                raise ValidationError(
                    "Date of purchase has an invalid format. It must be in YYYY-MM-DD format."
                )

            asset_type, asset_type_created = AssetType.objects.get_or_create(
                asset_type_name=row["Asset Category"]
            )
            business_unit, business_unit_created = BusinessUnit.objects.get_or_create(
                business_unit_name=row["BU"]
            )
            custodian = Employee.objects.get_or_create(employee_name=row["Custodian"])
            location, location_created = Location.objects.get_or_create(
                location_name=row["Location"]
            )
            invoice_location, invoice_location_created = Location.objects.get_or_create(
                location_name=row["Invoice Location"]
            )
            memory, memory_created = Memory.objects.get_or_create(
                memory_space=row["Memory"]
            )
            warranty = row["Warranty"]
            if warranty == "Expired":
                warranty = -1

            status = row["status"]
            if status == "No Service":
                status = "UNREPAIRABLE"
            elif status == "In Service" and row["Custodian"]:
                status = "IN USE"
            elif status == "In Service" and not row[custodian]:
                status = "IN STORE"
            elif status == "Damaged":
                status = "DAMAGED"
            elif status == "Expired":
                status = "OUTDATED"

            if row["Approval Status"] == "Approved":
                asset_detail_status = "CREATED"
            elif row["Approval Status"] == "Pending":
                asset_detail_status = "UPDATE PENDING"
            elif row["Approval Status"] == "Rejected":
                asset_detail_status == "UPDATE REJECTED"

            if row["Custodian"]:
                assign_status = "ASSIGNED"
            else:
                assign_status = "UNASSIGNED"

            asset = Asset(
                asset_id=asset_id,
                version=row["Version"],
                asset_category=row["Category"],
                product_name=row["Product Name"],
                model_number=row["Model Number"],
                serial_number=row["Serial Number"],
                owner=row["Owner"],
                date_of_purchase=purchase_date,
                status=status,
                warranty_period=warranty,
                os=row["OS"],
                os_version=row["OS Version"],
                mobile_os=row["Mobile OS"],
                processor=row["Processor"],
                processor_gen=row["Generation"],
                storage=row["Storage"],
                configuration=row["Configuration"],
                accessories=row["Accessories"],
                notes=row["Notes"],
                asset_detail_status=asset_detail_status,
                assign_status=assign_status,
                approval_status_message=row["approval_status_message"],
                created_at=row["created_at"],
                updated_at=row["updated_at"],
                is_deleted=row["is_deleted"],
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

        # return output.getvalue()
        return output

    @staticmethod
    def generate_missing_fields_xlsx(missing_fields_assets):
        if missing_fields_assets:
            df = pd.DataFrame(missing_fields_assets)
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
