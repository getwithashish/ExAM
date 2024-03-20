from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from asset.models import AssetType, BusinessUnit, Location, Memory
from user_auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import Permission


class AssetViewCreateTests(APITestCase):

    def setUp(self):
        self.lead_permission, _ = Permission.objects.get_or_create(
            codename="isLead",
            name="Can create an asset",
            content_type_id=1,
        )
        self.lead_user = User.objects.create_user(
            username="lead",
            password="password",
            email="lead@example.com",
            user_scope="LEAD",
        )
        self.lead_user.user_permissions.add(self.lead_permission)
        self.lead_client = APIClient()
        self.lead_token = str(AccessToken.for_user(self.lead_user))
        self.lead_client.credentials(HTTP_AUTHORIZATION="Bearer " + self.lead_token)
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
        self.asset_data = {
            "asset_id": "91023",
            "version": 5,
            "asset_category": "HARDWARE",
            "product_name": "HP Pavilion Yahoo Smart Glass",
            "model_number": "HPModel2423",
            "serial_number": "001234",
            "owner": "EXPERION",
            "date_of_purchase": "2024-02-20",
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
            "asset_detail_status": "CREATED",
            "assign_status": "UNASSIGNED",
            "approval_status_message": "test approval",
            "created_at": "2024-03-18T19:40:23.429847Z",
            "updated_at": "2024-03-18T19:40:23.429847Z",
            "is_deleted": 0,
            "asset_type": self.asset_type.pk,
            "custodian": self.user.pk,
            "location": self.location.pk,
            "invoice_location": self.invoice_location.pk,
            "business_unit": self.business_unit.pk,
            "memory": self.memory.pk,
            "approved_by": self.user.pk,
            "requester": self.user.pk,
        }

    def test_lead_create_asset(self):
        url = reverse("asset")
        response = self.lead_client.post(url, self.asset_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_asset_invalid_data_format(self):
        url = reverse("asset")
        invalid_data = self.asset_data.copy()
        invalid_data["date_of_purchase"] = "invalid_date"
        response = self.lead_client.post(url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("date_of_purchase", response.data["data"])

    def test_lead_create_asset_valid_data(self):
        url = reverse("asset")
        response = self.lead_client.post(url, self.asset_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("asset_id", response.data["data"])
        self.assertEqual(response.data["data"]["asset_category"], "HARDWARE")
        self.assertEqual(
            response.data["data"]["product_name"], "HP Pavilion Yahoo Smart Glass"
        )
        self.assertIsInstance(response.data["data"]["processor_gen"], str)
        self.assertIsInstance(response.data["data"]["storage"], str)

   
