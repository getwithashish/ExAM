# from django.test import APITestCase, Client
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from asset.models import Location
from user_auth.models import User
from rest_framework_simplejwt.tokens import AccessToken

class TestLocationViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client = APIClient()
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.location_data = {"location_name": "Test Location"}

        
        Location.objects.create(location_name="Test Location 1")
        Location.objects.create(location_name="Test Location 2")

    def test_create_location(self):
        url = reverse("location")
        location_data = {"location_name": "Test Location"}
        response = self.client.post(url, location_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Location.objects.count(), 3)  
        self.assertEqual(Location.objects.last().location_name, location_data["location_name"])

    def test_retrieve_locations(self):
        url = reverse("location")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_filter_locations(self):
        Location.objects.create(location_name="Another Location")
        url = reverse("location") + "?query=Test"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)