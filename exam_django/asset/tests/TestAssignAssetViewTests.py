# from rest_framework.test import APITestCase
# from rest_framework import status
# from rest_framework.test import APITestCase, APIClient
# from django.urls import reverse
# from asset.models import BusinessUnit, Location, Employee, Asset, AssetType
# from user_auth.models import User
# from rest_framework_simplejwt.tokens import AccessToken
# from datetime import date  # Import the date class from datetime module
# import uuid


# class TestAssignAssetViewTests(APITestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.user = User.objects.create(username='testuser', user_scope='LEAD')
#         self.client.force_authenticate(user=self.user)
#         self.employee = Employee.objects.create(id=1, employee_name="John Doe")
#         self.asset_type = AssetType.objects.create(asset_type_name='Test Asset Type')
#         self.business_unit = BusinessUnit.objects.create(business_unit_name='Test Business Unit')

#         asset_type_instance = AssetType.objects.create(asset_type_name="Your Asset Type")
#         self.asset = Asset.objects.create(
#             asset_uuid=uuid.uuid4(),
#             asset_id="your_asset_id",
#             version=1,
#             asset_category="HARDWARE",
#             asset_type=asset_type_instance,
#             product_name="your_product_name",
#             date_of_purchase=date(2022, 3, 25),  # Provide a valid date for date_of_purchase
#         )

#     def test_assign_asset_success(self):
#         url = reverse("assign_asset")
#         data = {"asset_uuid": str(self.asset.asset_uuid), "id": 1}  # Convert asset_uuid to str
#         response = self.client.post(url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Asset.objects.get(asset_uuid=self.asset.asset_uuid).assign_status, "ASSIGNED")






