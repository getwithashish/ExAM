import csv
from faker import Faker


fake = Faker()

# Define the number of rows to generate
num_rows = 400

# Open a file in write mode
file_path = r"c:\Users\ashish.george\Downloads\sample_data.csv"
with open(file_path, mode="w", newline="") as file:
    writer = csv.writer(file)

    # Write the header row
    writer.writerow(
        [
            "asset_id",
            "version",
            "asset_category",
            "product_name",
            "model_number",
            "serial_number",
            "owner",
            "date_of_purchase",
            "status",
            "warranty_period",
            "os",
            "os_version",
            "mobile_os",
            "processor",
            "processor_gen",
            "storage",
            "configuration",
            "accessories",
            "notes",
            "asset_detail_status",
            "approval_status_message",
            "created_at",
            "updated_at",
            "requester",
            "is_deleted",
            "conceder",
            "asset_type",
            "business_unit",
            "custodian",
            "invoice_location",
            "location",
            "memory",
        ]
    )

    # Generate and write each row of fake data
    for _ in range(num_rows):
        writer.writerow(
            [
                fake.uuid4(),  # asset_id
                fake.random_int(min=0, max=10),  # version
                "HARDWARE",  # asset_category
                fake.random_element(
                    elements=(
                        "Samsung Galaxy S21 Ultra ",
                        "Google Pixel 6 Pro ",
                        "OnePlus 9 Pro",
                    )
                ),  # product_name
                fake.random_int(min=2, max=1000),
                # model_number
                fake.random_int(),  # serial_number
                "EXPERION",  # owner
                fake.date(),  # date_of_purchase
                "IN USE",  # status
                fake.random_element(elements=(12, 24)),  # warranty_period
                "",  # os
                "",  # os_version
                "Android",  # mobile_os
                "Snapdragon 880",  # processor
                "8",  # processor_gen
                "256",  # storage
                fake.random_element(
                    elements=(
                        "Flagship Smartphones",
                        "Mid-Range Smartphones",
                    )
                ),  # configuration
                fake.random_element(elements=("Charger", "Ear Phones")),  # accessories
                "Good",  # notes
                "CREATED",  # asset_detail_status
                "Approved",  # approval_status_message
                fake.date_time_this_year(),  # created_at
                fake.date_time_this_year(),  # updated_at
                "ashish.sysadmin",  # requester_id
                False,  # is_deleted
                fake.random_element(
                    elements=("ashish.manager", "ashish.lead")
                ),  # conceder_id
                "Smartphone",  # asset_type_id
                fake.random_element(
                    elements=("DU1", "DU2", "DU3", "DU4")
                ),  # business_unit_id
                fake.random_element(
                    elements=("Pratheep", "Jayan", "Suresh", "Mahesh")
                ),  # custodian
                fake.random_element(
                    elements=("Trivandrum", "Kochi", "Banglore")
                ),  # invoice_location
                fake.random_element(
                    elements=("Trivandrum", "Kochi", "Banglore")
                ),  # location
                fake.random_element(elements=(4, 8, 16)),  # memory_id
            ]
        )
