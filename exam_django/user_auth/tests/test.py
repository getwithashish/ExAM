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

class UserRegistrationViewTests(APITestCase):
    def test_register_user(self):
        url = reverse("jwt_signup")
        data = {"username": "newuser", "password": "test123", "first_name": "New", "last_name": "User"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Add more assertions as needed

class UsernameAndUserscopeTokenObtainPairViewTests(APITestCase):
    def test_obtain_token(self):
        url = reverse("jwt_signin")
        data = {"username": "testuser", "password": "12345"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions as needed
