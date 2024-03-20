import uuid
from asset.models import Asset, AssetType, BusinessUnit, Employee, Location, Memory
from datetime import datetime, date
from user_auth.models import User  # Import your custom User model
from django.test import TestCase


class AssetExportViewTestCase(TestCase):
    def setUp(self):
        # Generate UUIDs for asset_uuid field
        asset_uuid_1 = uuid.uuid4()
        asset_uuid_2 = uuid.uuid4()

        # Create a BusinessUnit instance
        self.business_unit = BusinessUnit.objects.create(
            business_unit_name="Test Business Unit"
        )

        # Create a Location instance
        self.location = Location.objects.create(location_name="Test Location")

        # Create an Invoice Location instance
        self.invoice_location = Location.objects.create(
            location_name="Test Invoice Location"
        )

        # Create a Memory instance
        self.memory = Memory.objects.create(memory_space=32)

        # Create a requester User instance using your custom User model
        self.requester_user = User.objects.create_user(username="requester_name")

        # Create a valid AssetType instance
        self.asset_type = AssetType.objects.create(asset_type_name="Test Asset Type")

        # Create a valid Employee instance for custodian
        self.custodian = Employee.objects.create(
            employee_name="Custodian Name", employee_department="IT"
        )

        # Create some test assets with valid details
        self.asset1 = Asset.objects.create(
            asset_uuid=asset_uuid_1,
            asset_id="12345",
            version=1,
            asset_category="HARDWARE",
            product_name="Sample Product 1",
            model_number="Sample Model 1",
            serial_number="SN12345",
            owner="Owner Name",
            date_of_purchase=date.today(),
            status="IN STORE",
            warranty_period=2,
            os="WINDOWS",
            os_version="11",
            mobile_os="Android",
            processor="Intel Core i7",
            processor_gen=10,
            storage=512,
            configuration="i7/16GB/512GB",
            accessories="Keyboard, Mouse",
            notes="Sample notes for asset 1",
            asset_detail_status="CREATE_PENDING",
            assign_status="UNASSIGNED",
            approval_status_message="",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            is_deleted=False,
            asset_type=self.asset_type,
            custodian=self.custodian,
            requester=self.requester_user,  # Assign the requester_user here
            business_unit=self.business_unit,
            location=self.location,
            invoice_location=self.invoice_location,
            memory=self.memory,
        )

        self.asset2 = Asset.objects.create(
            asset_uuid=asset_uuid_2,
            asset_id="67890",
            version=1,
            asset_category="SOFTWARE",
            product_name="Sample Product 2",
            model_number="Sample Model 2",
            serial_number="SN67890",
            owner="Owner Name 2",
            date_of_purchase=date.today(),
            status="IN USE",
            warranty_period=3,
            os="LINUX",
            os_version="Ubuntu",
            mobile_os="iOS",
            processor="AMD Ryzen 5",
            processor_gen=7,
            storage=1024,
            configuration="Ryzen 5/8GB/1TB",
            accessories="Headphones, Webcam",
            notes="Sample notes for asset 2",
            asset_detail_status="CREATE_PENDING",
            assign_status="UNASSIGNED",
            approval_status_message="",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            is_deleted=False,
            asset_type=self.asset_type,
            custodian=self.custodian,
            requester=self.requester_user,  # Assign the requester_user here
            business_unit=self.business_unit,
            location=self.location,
            invoice_location=self.invoice_location,
            memory=self.memory,
        )
