# from django.test import APITestCase, Client
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from asset.models import BusinessUnit,Location,Employee,Asset,AssetType
from user_auth.models import User
from rest_framework_simplejwt.tokens import AccessToken

class BusinessUnitViewTests(APITestCase):
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

class EmployeeViewTests(APITestCase):
    def setUp(self):
        self.employee1 = Employee.objects.create(employee_name="John Doe", employee_department="HR", employee_designation="Manager")
        self.employee2 = Employee.objects.create(employee_name="Jane Smith", employee_department="Finance", employee_designation="Analyst")

        self.user = User.objects.create_user(username='testuser', password='password')

     
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

class LocationViewTests(APITestCase):
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













# class AssignAssetViewTests(APITestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.user = User.objects.create(username='testuser', user_scope='LEAD')  
#         self.client.force_authenticate(user=self.user)
#         self.employee = Employee.objects.create(id=1, employee_name="John Doe")  
#         self.asset = Asset.objects.create(asset_uuid="2ebc428d30b64ac4b219137541662385", status="UNASSIGNED", assign_status="UNASSIGNED")
#         self.asset_type = AssetType.objects.create(asset_type_name='Test Asset Type')
#         self.business_unit = BusinessUnit.objects.create(business_unit_name='Test Business Unit')
#     def test_assign_asset_success(self):
#         url = reverse("assign_asset")
#         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}
#         response = self.client.post(url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Asset.objects.get(asset_uuid="2ebc428d30b64ac4b219137541662385").assign_status, "ASSIGNED")

#     def test_assign_asset_expired_asset(self):
#         self.asset.status = "EXPIRED"
#         self.asset.save()
#         url = reverse("assign_asset")
#         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}
#         response = self.client.post(url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_assign_asset_assigned_asset(self):
#         self.asset.assign_status = "ASSIGNED"
#         self.asset.save()
#         url = reverse("assign_asset")
#         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}
#         response = self.client.post(url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_assign_asset_manager_attempt(self):
#         self.user.user_scope = 'MANAGER' 
#         self.user.save()
#         url = reverse("assign_asset")
#         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}
#         response = self.client.post(url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_assign_asset_invalid_employee(self):
#         url = reverse("assign_asset")
#         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 2} 
#         response = self.client.post(url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

#     def test_assign_asset_invalid_asset(self):
#         url = reverse("assign_asset")
#         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}  
#         response = self.client.post(url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)