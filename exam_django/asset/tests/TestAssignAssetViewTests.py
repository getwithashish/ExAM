# # from django.test import APITestCase, Client
# from rest_framework.test import APITestCase, APIClient
# from django.urls import reverse
# from rest_framework import status
# from asset.models import BusinessUnit,Location,Employee,Asset,AssetType
# from user_auth.models import User
# from rest_framework_simplejwt.tokens import AccessToken
# from datetime import date  # Import the date class from datetime module
# import uuid
# class TestAssignAssetViewTests(APITestCase):
#    def setUp(self):
#     self.client = APIClient()
#     self.user = User.objects.create(username='testuser', user_scope='LEAD')  
#     self.client.force_authenticate(user=self.user)
#     self.employee = Employee.objects.create(id=1, employee_name="John Doe")  
#     self.asset_type = AssetType.objects.create(asset_type_name='Test Asset Type')  # Create AssetType
#     self.asset = Asset.objects.create(asset_uuid="2ebc428d30b64ac4b219137541662385", 
#                                       status="UNASSIGNED", 
#                                       assign_status="UNASSIGNED",
#                                       asset_type=self.asset_type)  # Provide asset_type
#     self.business_unit = BusinessUnit.objects.create(business_unit_name='Test Business Unit')
#     asset_type_instance = AssetType.objects.create(asset_type_name="Your Asset Type")

#     self.asset = Asset.objects.create(
#             asset_uuid=uuid.uuid4(),
#             asset_id="your_asset_id",
#             version=1,
#             asset_category="HARDWARE",
#             asset_type=asset_type_instance,
#             product_name="your_product_name",
#             date_of_purchase=date(2022, 3, 25),  
         
#         )
#    def test_assign_asset_success(self):
#         url = reverse("assign_asset")
#         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}
#         response = self.client.post(url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Asset.objects.get(asset_uuid="2ebc428d30b64ac4b219137541662385").assign_status, "ASSIGNED")
#         self.asset = Asset.objects.create(
#             asset_uuid=uuid.uuid4(),
#             asset_id="1",
#             version=1,
#             asset_category="HARDWARE",
#             product_name="HP",
#             date_of_purchase=date(2022, 3, 25),  
         
#         )
# #    def test_assign_asset_expired_asset(self):
# #         self.asset.status = "EXPIRED"
# #         self.asset.save()
# #         url = reverse("assign_asset")
# #         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}
# #         response = self.client.post(url, data, format="json")
# #         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# #    def test_assign_asset_assigned_asset(self):
# #         self.asset.assign_status = "ASSIGNED"
# #         self.asset.save()
# #         url = reverse("assign_asset")
# #         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}
# #         response = self.client.post(url, data, format="json")
# #         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# #    def test_assign_asset_manager_attempt(self):
# #         self.user.user_scope = 'MANAGER' 
# #         self.user.save()
# #         url = reverse("assign_asset")
# #         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}
# #         response = self.client.post(url, data, format="json")
# #         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

# #    def test_assign_asset_invalid_employee(self):
# #         url = reverse("assign_asset")
# #         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 2} 
# #         response = self.client.post(url, data, format="json")
# #         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
# #    def test_assign_asset_invalid_asset(self):
# #         url = reverse("assign_asset")
# #         data = {"asset_uuid": "2ebc428d30b64ac4b219137541662385", "id": 1}  
# #         response = self.client.post(url, data, format="json")
# #         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)