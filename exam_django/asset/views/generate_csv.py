import csv
from faker import Faker


fake = Faker()

# Define the number of rows to generate
num_rows = 1000

# Open a file in write mode
file_path = r"c:\Users\aidrin.varghese\Downloads\sample_data.csv"
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
                    elements=("ACER V227Q", "SAMSUNG S3422", "MSI PRO MP241X")
                ),  # product_name
                fake.word(),  # model_number
                fake.uuid4(),  # serial_number
                fake.random_element(elements=("EXPERION")),  # owner
                fake.date(),  # date_of_purchase
                "IN STORE",  # status
                fake.random_element(elements=(12, 24)),  # warranty_period
                "",  # os
                "",  # os_version
                "",  # mobile_os
                "",  # processor
                "",  # processor_gen
                "",  # storage
                "",  # configuration
                fake.random_element(
                    elements=("HDMI cable", "extension cable")
                ),  # accessories
                fake.text(),  # notes
                fake.random_element(
                    elements=("UPDATED", "UPDATE_PENDING", "CREATED", "CREATE_PENDING")
                ),  # asset_detail_status
                fake.sentence(),  # approval_status_message
                fake.date_time_this_year(),  # created_at
                fake.date_time_this_year(),  # updated_at
                fake.random_element(elements=("Aidrin", "Ashish")),  # requester_id
                False,  # is_deleted
                fake.random_element(elements=("Ananthan", "Asima")),  # conceder_id
                "Laptop",  # asset_type_id
                fake.random_element(elements=("DU1", "DU2")),  # business_unit_id
                "",  # custodian
                fake.random_element(
                    elements=("Trivandrum", "Kochi")
                ),  # invoice_location
                fake.random_element(elements=("Trivandrum", "Kochi")),  # location
                0,  # memory_id
            ]
        )
