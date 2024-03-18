from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from asset.models import BusinessUnit
from user_auth.models import User  # Import your custom user model here

class BusinessUnitViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')  # Use your custom user model here
        self.client.force_login(self.user)  # Use force_login to authenticate the user in the tests
        self.business_unit_data = {"business_unit_name": "Test Business Unit"}

    def test_create_business_unit(self):
        url = reverse("business_unit")
        response = self.client.post(url, self.business_unit_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BusinessUnit.objects.count(), 1)
        self.assertEqual(
            BusinessUnit.objects.get().business_unit_name,
            self.business_unit_data["business_unit_name"],
        )

    def test_retrieve_business_units(self):
        # Create some test business units
        BusinessUnit.objects.create(business_unit_name="Business Unit 1")
        BusinessUnit.objects.create(business_unit_name="Business Unit 2")

        url = reverse("business_unit")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Check if all business units are retrieved

    def test_filter_business_units(self):
        # Create some test business units
        BusinessUnit.objects.create(business_unit_name="Test Business Unit 1")
        BusinessUnit.objects.create(business_unit_name="Another Business Unit")
        BusinessUnit.objects.create(business_unit_name="Test Business Unit 2")

        url = reverse("business_unit") + "?query=Test"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Check if only matching business units are retrieved
