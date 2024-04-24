import csv
import openpyxl

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status
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
            file_type = request.query_params.get(
                "file_type", ""
            ).lower()  # Get file type from query parameters
            print("File Type: ", file_type)
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

            result = AssetImportService.parse_and_add_assets(
                file.read(), user, file_type
            )

            if isinstance(result, bytes):  # If result is bytes, it's an XLSX file
                response = HttpResponse(
                    result,
                    content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
                response["Content-Disposition"] = (
                    'attachment; filename="missing_fields.xlsx"'
                )
                return response
            elif result["missing_fields_assets"] or result["skipped_fields_assets"]:
                if file_type == "csv":
                    skipped_fields_data = (
                        AssetImportService.generate_missing_fields_csv(
                            result["skipped_fields_assets"]
                        )
                    )
                    missing_fields_data = (
                        AssetImportService.generate_missing_fields_csv(
                            result["missing_fields_assets"]
                        )
                    )
                    # content_type = 'text/csv'
                elif file_type == "xlsx":
                    skipped_fields_data = (
                        AssetImportService.generate_missing_fields_xlsx(
                            result["skipped_fields_assets"]
                        )
                    )
                    missing_fields_data = (
                        AssetImportService.generate_missing_fields_xlsx(
                            result["missing_fields_assets"]
                        )
                    )
                    # content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                else:
                    return APIResponse(
                        data=[],
                        message=INVALID_FILE_TYPE,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if file_type == "csv":
                    data_to_be_returned = AssetImportService.generate_zip_file_csv(
                        skipped_fields_data, missing_fields_data
                    )
                elif file_type == "xlsx":
                    data_to_be_returned = AssetImportService.generate_zip_file_xlsx(
                        skipped_fields_data, missing_fields_data
                    )

                content_type = "application/zip"
                response = HttpResponse(data_to_be_returned, content_type=content_type)
                response["Content-Disposition"] = (
                    'attachment; filename="import_status.zip"'
                )

                # response = HttpResponse(missing_fields_data, content_type=content_type)
                # response["Content-Disposition"] = (
                #     'attachment; filename="missing_fields.xlsx"'
                # )
                return response
            else:
                return APIResponse(
                    data=result,
                    message="All assets uploaded successfully.",
                    status=status.HTTP_200_OK,
                )

        except UnicodeDecodeError:
            return APIResponse(
                data=[],
                message=INVALID_FILE_TYPE,
                status=status.HTTP_400_BAD_REQUEST,
            )
