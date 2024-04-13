import csv
import io
import pandas as pd

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status
from asset.models.asset import Asset
from asset.service.data_import_service.data_import_service import AssetImportService
from user_auth.rbac import IsLead
from response import APIResponse
from messages import INVALID_FILE_TYPE, FILE_NOT_FOUND

class DataImportView(APIView):
    permission_classes = (IsLead,)

    def post(self, request, format=None):
        try:
            user = request.user
            file = request.FILES.get("file")
            file_type = request.query_params.get("file_type", "").lower()  # Get file type from query parameters
            if not file_type or file_type not in ["csv", "xlsx"]:
                return APIResponse(
                    data=[],
                    message=INVALID_FILE_TYPE,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not file:
                return APIResponse(
                    data=[],
                    message=FILE_NOT_FOUND,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            result = AssetImportService.parse_and_add_assets(file.read(), user, file_type)

            if result["missing_fields_assets"]:
                if file_type == "csv":
                    csv_data = AssetImportService.generate_missing_fields_csv(result["missing_fields_assets"])
                    missing_fields_data = io.StringIO(csv_data)
                    content_type = 'text/csv'
                    filename = "missing_fields.csv"
                elif file_type == "xlsx":
                    df = pd.DataFrame(result["missing_fields_assets"])
                    missing_fields_data = io.BytesIO()
                    df.to_excel(missing_fields_data, index=False)
                    missing_fields_data.seek(0)
                    content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    filename = "missing_fields.xlsx"
                else:
                    return APIResponse(
                        data=[],
                        message=INVALID_FILE_TYPE,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                response = HttpResponse(missing_fields_data.getvalue(), content_type=content_type)
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                return response
            else:
                return APIResponse(
                    data=result,
                    message="All assets uploaded successfully.",
                    status=status.HTTP_200_OK
                )

        except UnicodeDecodeError:
            return APIResponse(
                data=[],
                message=INVALID_FILE_TYPE,
                status=status.HTTP_400_BAD_REQUEST,
            )
