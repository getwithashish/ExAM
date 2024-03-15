import csv
from faker import Faker


fake = Faker()

# Define the number of rows to generate
num_rows = 3000

# Open a file in write mode
file_path = r"c:\Users\ananthakrishnan.cj\Downloads\sample_data.csv"
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
            "approval_status",
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
                fake.random_element(
                    elements=("HARDWARE", "SOFTWARE")
                ),  # asset_category
                fake.word(),  # product_name
                fake.word(),  # model_number
                fake.uuid4(),  # serial_number
                fake.word(),  # owner
                fake.date(),  # date_of_purchase
                fake.random_element(
                    elements=("IN USE", "IN STORE", "IN REPAIR", "EXPIRED", "DISPOSED")
                ),  # status
                fake.random_int(min=0, max=10),  # warranty_period
                fake.random_element(elements=("WINDOWS", "LINUX", "MAC")),  # os
                fake.random_element(
                    elements=("Windows 10", "Ubuntu", "MacOS")
                ),  # os_version
                fake.word(),  # mobile_os
                fake.word(),  # processor
                fake.word(),  # processor_gen
                fake.random_element(elements=("16GB", "32GB", "64GB")),  # storage
                fake.word(),  # configuration
                fake.word(),  # accessories
                fake.text(),  # notes
                fake.random_element(
                    elements=("APPROVED", "REJECTED")
                ),  # approval_status
                fake.sentence(),  # approval_status_message
                fake.date_time_this_year(),  # created_at
                fake.date_time_this_year(),  # updated_at
                fake.random_element(elements=("Ananthan", "Pavithra")),  # requester_id
                fake.boolean(),  # is_deleted
                fake.random_element(elements=("Ananthan", "Pavithra")),  # conceder_id
                fake.random_element(elements=("Laptop", "Monitor")),  # asset_type_id
                fake.random_element(elements=("DU1", "DU2")),  # business_unit_id
                fake.random_element(elements=("Mahesh", "Suresh")),  # custodian
                fake.random_element(
                    elements=("Trivandrum", "Kochi")
                ),  # invoice_location
                fake.random_element(elements=("Trivandrum", "Kochi")),  # location
                fake.random_int(),  # memory_id
            ]
        )
