from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from asset.service.data_import_crud_service.data_import_service import AssetImportService
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

            # Use the AssetImportService to process the file
            result = AssetImportService.parse_and_add_assets(file.read(), user)
            
            # Include import summary in the response
            response_data = {
                "message": result["message"],
                "added_assets_count": result["added_assets_count"],
                "skipped_assets_count": result["skipped_assets_count"]
            }

            return JsonResponse(response_data, status=status.HTTP_200_OK)

        except UnicodeDecodeError:
            return APIResponse(
                data=[],
                message=INVALID_CSV_FILE_TYPE,
                status=status.HTTP_400_BAD_REQUEST,
            )
