from rest_framework.test import APITestCase
from django.urls import reverse
from asset.models import Asset, Location, AssetType, Memory, BusinessUnit, Employee
from user_auth.models import User
from rest_framework_simplejwt.tokens import AccessToken


class AssetApproveViewTestCase(APITestCase):
    def setUp(self):
        # Create test data for related models
        self.asset_type = AssetType.objects.create(asset_type_name="Test Asset Type")
        self.business_unit = BusinessUnit.objects.create(
            business_unit_name="Test Business Unit"
        )
        self.location = Location.objects.create(location_name="Test Location")
        self.invoice_location = Location.objects.create(
            location_name="Test Invoice Location"
        )
        self.memory = Memory.objects.create(memory_space=32)
        self.user = User.objects.create_user(
            username="user", password="password", email="user@example.com"
        )
        self.requester = User.objects.create_user(
            username="requester", password="password", email="requester@example.com"
        )

        # Retrieve the AssetType, Employee, and BusinessUnit instances corresponding to the primary keys
        asset_type_instance = AssetType.objects.get(pk=self.asset_type.pk)
        custodian_instance = Employee.objects.create(
            employee_name="John Doe",
            employee_department="IT",
            employee_designation="Manager",
        )  # Create a new Employee instance

        # Create an asset with a valid date_of_purchase
        self.asset_data = {
            "asset_id": "91023",
            "version": 5,
            "asset_category": "HARDWARE",
            "product_name": "HP Pavilion Yahoo Smart Glass",
            "model_number": "HPModel2423",
            "serial_number": "001234",
            "owner": "EXPERION",
            "date_of_purchase": "2022-08-02",  # Correctly formatted date
            "status": "IN STORE",
            "warranty_period": 4,
            "os": "WINDOWS",
            "os_version": "11",
            "mobile_os": "test mobile os",
            "processor": "test processor",
            "processor_gen": 11,
            "storage": 512,
            "configuration": "i5/8GB/256GB+SSD",
            "accessories": "bag,charger",
            "notes": "Asset laptop added",
            "asset_detail_status": "CREATE_PENDING",
            "assign_status": "UNASSIGNED",
            "approval_status_message": "",
            "created_at": "2024-03-18T19:40:23.429847Z",
            "updated_at": "2024-03-18T19:40:23.429847Z",
            "is_deleted": False,
            "asset_type": asset_type_instance,  # Provide the AssetType instance
            "custodian": custodian_instance,  # Provide the Employee instance
            "location": self.location,  # Provide the Location instance
            "invoice_location": self.invoice_location,  # Provide the Invoice Location instance
            "business_unit": self.business_unit,  # Provide the BusinessUnit instance
            "memory": self.memory,  # Provide the Memory instance
            "approved_by": None,
            "requester": self.requester,  # Provide the User instance
        }

        # Create the Asset instance
        self.asset = Asset.objects.create(**self.asset_data)

    def test_approve_asset(self):
        # Obtain a token for the user
        token = AccessToken.for_user(self.user)

        # Send a POST request to approve the asset with authentication token
        url = reverse("approve_asset")
        data = {
            "approval_type": "ASSET_DETAIL_STATUS",
            "asset_uuid": str(self.asset.asset_uuid),
            "comments": "Approved",
        }
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + str(token))
