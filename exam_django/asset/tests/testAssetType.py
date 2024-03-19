from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from asset.models import AssetType
from user_auth.models import User  # Import your custom user model here
from rest_framework_simplejwt.tokens import AccessToken


class AssetTypeViewTests(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')  # Use your custom user model here
        self.client = APIClient()
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)  # Use force_login to authenticate the user in the tests
        self.asset_type_data = {"asset_type_name": "Test Asset Type"}

    def test_create_asset_type(self):
        self.client.force_login(self.user)
        url = reverse("asset_type")
        response = self.client.post(url, self.asset_type_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AssetType.objects.count(), 1)
        self.assertEqual(
            AssetType.objects.get().asset_type_name,
            self.asset_type_data["asset_type_name"],
        )

    def test_retrieve_asset_types(self):
        # Create some test asset types
        AssetType.objects.create(asset_type_name="Asset Type 1")
        AssetType.objects.create(asset_type_name="Asset Type 2")

        url = reverse("asset_type")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Check if all asset types are retrieved

    def test_filter_asset_types(self):
        # Create some test asset types
        AssetType.objects.create(asset_type_name="Test Asset Type 1")
        AssetType.objects.create(asset_type_name="Another Asset Type")
        AssetType.objects.create(asset_type_name="Test Asset Type 2")

        url = reverse("asset_type") + "?query=Test"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Check if only matching asset types are retrieved
