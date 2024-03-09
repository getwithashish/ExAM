import csv
from django.http import HttpResponse
from asset.models import Asset
import os
from django.conf import settings
from asset.models import User, AssetType, BusinessUnit, Employee, Location, Memory


def parse_and_add_assets():
    csv_file_path = os.path.join(settings.BASE_DIR, "asset", "static", "AssetCsv.csv")
    print(csv_file_path)

    if os.path.exists(csv_file_path):
        print("Path Exists")
        with open(csv_file_path, "r") as csv_file:
            csv_reader = csv.reader(csv_file)

            # Skip the header row
            next(csv_reader)

            for row in csv_reader:

                # Look up the User instance for conceder and requester using their concatenated first_name and last_name
                conceder_first_name, conceder_last_name = row[26].split(" ")
                conceder_user = User.objects.filter(
                    first_name=conceder_first_name, last_name=conceder_last_name
                ).first()
                requester_first_name, requester_last_name = row[27].split(" ")
                requester_user = User.objects.filter(
                    first_name=requester_first_name, last_name=requester_last_name
                ).first()

                asset_type = AssetType.objects.filter(asset_type_name=row[28]).first()
                business_unit = BusinessUnit.objects.filter(
                    business_unit_name=row[29]
                ).first()

                custodian = Employee.objects.filter(employee_name=row[30]).first()
                location = Location.objects.filter(location_name=row[32]).first()
                invoice_location = Location.objects.filter(
                    location_name=row[31]
                ).first()
                memory = Memory.objects.filter(memory_space=row[33]).first()
                Asset.objects.create(
                    asset_id=row[1],
                    version=row[2],
                    asset_category=row[3],
                    product_name=row[4],
                    model_number=row[5],
                    serial_number=row[6],
                    owner=row[7],
                    date_of_purchase=row[8],
                    status=[9],
                    warranty_period=row[10],
                    os=row[11],
                    os_version=row[12],
                    mobile_os=row[13],
                    processor=row[14],
                    processor_gen=row[15],
                    storage=row[16],
                    configuration=row[17],
                    accessories=row[18],
                    notes=row[19],
                    approval_status=row[20],
                    approval_status_message=row[21],
                    created_at=row[22],
                    updated_at=row[23],
                    request_type=row[24],
                    is_deleted=row[25],
                    conceder_id=conceder_user.id,
                    requester_id=requester_user.id,
                    asset_type_id=asset_type.id,
                    business_unit_id=business_unit.id,
                    custodian_id=custodian.id,
                    invoice_location_id=invoice_location.id,
                    location_id=location.id,
                    memory_id=memory.id,
                )

        return HttpResponse("Data added to Asset table successfully")

    return HttpResponse("CSV file does not exist or could not be opened")



