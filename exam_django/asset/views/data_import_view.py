# asset/views.py

import csv
import io
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework import status
from asset.models.asset import Asset
from asset.service.data_import_service.data_import_service import AssetImportService
from user_auth.rbac import IsLead
from response import APIResponse
from messages import INVALID_CSV_FILE_TYPE, FILE_NOT_FOUND

class DataImportView(APIView):
    permission_classes = (IsLead,)

    def post(self, request, format=None):
        try:
            user = request.user
            file = request.FILES.get("file")
            if not file:
                return APIResponse(
                    data=[],
                    message=FILE_NOT_FOUND,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            result = AssetImportService.parse_and_add_assets(file.read(), user)

            if result["missing_fields_assets"]:
                missing_fields_csv = AssetImportService.generate_missing_fields_csv(result["missing_fields_assets"])
                response = HttpResponse(missing_fields_csv, content_type='text/csv')
                response['Content-Disposition'] = 'attachment; filename="missing_fields.csv"'
                return response
            else:
                # Generate CSV file with consolidated assets
                assets = Asset.objects.all()
                csv_data = io.StringIO()
                csv_writer = csv.writer(csv_data)
                csv_writer.writerow([field.name for field in Asset._meta.fields])  # Write header
                for asset in assets:
                    csv_writer.writerow([getattr(asset, field.name) for field in Asset._meta.fields])  # Write data rows

                response = HttpResponse(csv_data.getvalue(), content_type='text/csv')
                response['Content-Disposition'] = 'attachment; filename="consolidated_assets.csv"'
                return response

        except UnicodeDecodeError:
            return APIResponse(
                data=[],
                message=INVALID_CSV_FILE_TYPE,
                status=status.HTTP_400_BAD_REQUEST,
            )
