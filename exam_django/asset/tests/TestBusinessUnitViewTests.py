from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from asset.models import BusinessUnit
from user_auth.models import User
from rest_framework_simplejwt.tokens import AccessToken

class TestBusinessUnitViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client = APIClient()
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.business_unit_data = {"business_unit_name": "Test Business Unit"}

    def test_create_business_unit(self):
        self.client.force_login(self.user)
        url = reverse("business_unit")
        response = self.client.post(url, self.business_unit_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BusinessUnit.objects.count(), 1)
        self.assertEqual(
            BusinessUnit.objects.get().business_unit_name,
            self.business_unit_data["business_unit_name"],
        )

    def test_retrieve_business_units(self):
        BusinessUnit.objects.create(business_unit_name="Business Unit 1")
        BusinessUnit.objects.create(business_unit_name="Business Unit 2")

        url = reverse("business_unit")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_business_units(self):
        BusinessUnit.objects.create(business_unit_name="Test Business Unit 1")
        BusinessUnit.objects.create(business_unit_name="Another Business Unit")
        BusinessUnit.objects.create(business_unit_name="Test Business Unit 2")

        url = reverse("business_unit") + "?query=Test"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
