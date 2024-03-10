import csv
from asset.models import (
    Asset,
    User,
    AssetType,
    BusinessUnit,
    Employee,
    Location,
    Memory,
)


def parse_and_add_assets(file_content):
    # Split the file content into lines and decode it as UTF-8
    csv_reader = csv.DictReader(file_content.decode("utf-8").splitlines())

    # Get existing asset IDs and serial numbers from the database
    existing_asset_ids = set(Asset.objects.values_list("asset_id", flat=True))
    existing_serial_numbers = set(Asset.objects.values_list("serial_number", flat=True))

    # Initialize counters for added and skipped assets
    added_assets_count = 0
    skipped_assets_count = 0

    # Iterate over each row in the CSV file
    for row in csv_reader:
        # Check if the asset ID or serial number already exists in the database
        if (
            row["asset_id"] in existing_asset_ids
            or row["serial_number"] in existing_serial_numbers
        ):
            # If duplicate, skip this row and increment the skipped count
            skipped_assets_count += 1
            continue

        # Look up related objects (users, asset types, business units, etc.) from the database
        conceder_user = User.objects.filter(
            first_name=row["conceder_id"], last_name=""
        ).first()
        requester_user = User.objects.filter(
            first_name=row["requester_id"], last_name=""
        ).first()
        asset_type = AssetType.objects.filter(
            asset_type_name=row["asset_type_id"]
        ).first()
        business_unit = BusinessUnit.objects.filter(
            business_unit_name=row["business_unit_id"]
        ).first()
        custodian = Employee.objects.filter(employee_name=row["custodian_id"]).first()
        location = Location.objects.filter(location_name=row["location_id"]).first()
        invoice_location = Location.objects.filter(
            location_name=row["invoice_location_id"]
        ).first()
        memory = Memory.objects.filter(memory_space=row["memory_id"]).first()

        # Create a new Asset object with the data from the CSV row
        Asset.objects.create(
            asset_id=row["asset_id"],
            version=row["version"],
            asset_category=row["asset_category"],
            product_name=row["product_name"],
            model_number=row["model_number"],
            serial_number=row["serial_number"],
            owner=row["owner"],
            date_of_purchase=row["date_of_purchase"],
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
            conceder_id=conceder_user.id if conceder_user else None,
            requester_id=requester_user.id if requester_user else None,
            asset_type_id=asset_type.id if asset_type else None,
            business_unit_id=business_unit.id if business_unit else None,
            custodian_id=custodian.id if custodian else None,
            invoice_location_id=invoice_location.id if invoice_location else None,
            location_id=location.id if location else None,
            memory_id=memory.id if memory else None,
        )

        # Update the existing asset ID and serial number sets and increment the added count
        existing_asset_ids.add(row["asset_id"])
        existing_serial_numbers.add(row["serial_number"])
        added_assets_count += 1

    # Prepare the message based on the added and skipped counts
    if added_assets_count == 0:
        message = "No new data found. All files are duplicates."
    else:
        message = (
            f"{added_assets_count} new data added to Asset table successfully. "
            f"{skipped_assets_count} duplicate entries omitted."
        )

    # Return the message as a dictionary
    return {"message": message}
