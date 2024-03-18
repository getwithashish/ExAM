from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from user_auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserRetrievalViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser', first_name='John', last_name='Doe')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_retrieve_users(self):
        url = reverse("getUsers")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions as needed

    def test_filter_users(self):
        url = reverse("getUsers") + "?name=John"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions as needed















