from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
import json
from datetime import datetime
from user_auth.models import User
from asset.models import (
    Asset,
    AssetLog,
    Location,
    BusinessUnit,
    Memory,
    AssetType,
    Employee,
)


class AssetLogViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        # Create necessary models for testing
        self.user = User.objects.create(username="test_user", email="test@example.com")

        self.asset_type = AssetType.objects.create(asset_type_name="Laptop")

        self.business_unit = BusinessUnit.objects.create(
            business_unit_name="IT Department"
        )

        # Create a basic Location instance
        self.location = Location.objects.create(location_name="Office")

        self.employee = Employee.objects.create(
            employee_name="John Doe",
            employee_department="IT",
            employee_designation="Engineer",
        )

        self.memory = Memory.objects.create(memory_space="8")

        # Create an asset
        self.asset = Asset.objects.create(
            asset_id="A123456",
            asset_category="HARDWARE",
            asset_type=self.asset_type,
            product_name="Dell Laptop",
            model_number="1234X",
            serial_number="XYZ123",
            owner="EXPERION",
            custodian=self.employee,
            date_of_purchase=datetime.now(),
            status="IN STORE",
            warranty_period=24,
            location=self.location,
            invoice_location=self.location,
            business_unit=self.business_unit,
            os="WINDOWS",
            os_version="10",
            mobile_os="iOS",
            processor="Intel Core i7",
            processor_gen="10th Gen",
            memory=self.memory,
            storage="512 GB SSD",
            configuration="Some configuration",
            accessories="Mouse, Keyboard",
            notes="Some notes",
            approved_by=self.user,
            asset_detail_status="CREATED",
            assign_status="ASSIGNED",
            approval_status_message="Approved",
            requester=self.user,
            is_deleted=False,
        )

        # Create asset log
        self.asset_log = AssetLog.objects.create(
            asset_uuid=self.asset, asset_log=json.dumps({"message": "Asset created"})
        )

    def test_get_asset_logs(self):
        url = reverse("asset_logs", kwargs={"asset_uuid": str(self.asset.asset_uuid)})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("data", response.data)
        self.assertIn("asset_uuid", response.data["data"])  # Adjusted assertion
        self.assertIn("logs", response.data["data"])  # Adjusted assertion
        # Add more assertions as needed

    def test_get_asset_logs_not_found(self):
        # Assuming a non-existent asset_uuid
        url = reverse(
            "asset_logs", kwargs={"asset_uuid": "11111111-1111-1111-1111-111111111111"}
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
