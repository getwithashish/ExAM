from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from asset.models import Employee
from user_auth.models import User


class TestEmployeeViewTests(APITestCase):
    def setUp(self):
        self.employee1 = Employee.objects.create(
            employee_name="John Doe",
            employee_department="HR",
            employee_designation="Manager",
        )
        self.employee2 = Employee.objects.create(
            employee_name="Jane Smith",
            employee_department="Finance",
            employee_designation="Analyst",
        )

        self.user = User.objects.create_user(username="testuser", password="password")

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_retrieve_employees(self):
        url = reverse("employee_view")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_employees_by_name(self):
        url = reverse("employee_view") + "?name=J"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
