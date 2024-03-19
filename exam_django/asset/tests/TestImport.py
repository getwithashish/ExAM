from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch
from io import BytesIO
from user_auth.models import User
from asset.models import Asset
from asset.views import DataImportView
from asset.views.CsvFileImportView import parse_and_add_assets

class TestDataImportView(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username="testuser", password="12345")

    @patch("asset.views.CsvFileImportView.parse_and_add_assets")
    def test_data_import_success(self, mock_parse_and_add_assets):
        # Prepare a CSV file content as bytes
        csv_content = (
            b"asset_id,version,asset_category,product_name,model_number,serial_number,"
            b"owner,date_of_purchase,status,warranty_period,os,os_version,mobile_os,"
            b"processor,processor_gen,storage,configuration,accessories,notes,"
            b"asset_detail_status,approval_status_message,created_at,updated_at,is_deleted,"
            b"conceder,requester,asset_type,business_unit,custodian,location,invoice_location,"
            b"memory\n"
            b"ASSET01,1,HARDWARE,Product A,Model A,SN123,Owner 1,2024-01-01,IN STORE,1,"
            b"Windows,10,Android,Intel,i7,SSD,Config A,Cable,Notes A,CREATED,Approved,"
            b"2024-03-18T12:00:00Z,2024-03-18T12:00:00Z,False,Conceder 1,Requester 1,"
            b"Type A,Business Unit A,Custodian 1,Location A,Location A,16\n"
        )

        # Mock the CSV file upload
        csv_file = BytesIO(csv_content)
        csv_file.name = "test_file.csv"
        csv_file.content_type = "text/csv"

        # Mock the parse_and_add_assets function to return a success message
        mock_parse_and_add_assets.return_value = {"message": "Assets imported successfully."}

        # Make a POST request to the data import endpoint with the mock CSV file
        url = reverse("csv_file_import")  # Corrected to match the URL pattern name 'csv_file_import'
        response = self.client.post(url, {"file": csv_file}, format="multipart")

        # Assert that the parse_and_add_assets function was called with the correct argum
