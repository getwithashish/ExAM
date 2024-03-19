from user_auth.models import User
from asset.models import Memory
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APITestCase


class TestMemoryView(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="12345")
        self.client.force_authenticate(user=self.user)

    def test_get_memories(self):
        Memory.objects.create(memory_space=16)
        Memory.objects.create(memory_space=64)

        url = reverse("memory_list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_memories(self):
        Memory.objects.create(memory_space=64)
        Memory.objects.create(memory_space=68)
        Memory.objects.create(memory_space=8)

        url = reverse("memory_list") + "?query=8"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # No memories should match the query

    def test_create_memory(self):
        url = reverse("memory_list")
        data = {"memory_space": 123}  # Adjust data as needed
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
