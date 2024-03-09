from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from asset.views.CsvFileImportView import parse_and_add_assets
from user_auth.rbac import IsSeniorLead
from response import APIResponse
from messages import (
    INVALID_CSV_FILE_TYPE,
    FILE_NOT_FOUND,
)


class DataImportView(APIView):

    permission_classes = (IsSeniorLead,)

    def post(self, request, format=None):
        try:
            # Check if the file is provided in the request
            file = request.FILES.get("file")
            if not file:

                return APIResponse(
                    data=[],
                    message=FILE_NOT_FOUND,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Read the file content
            file_content = file.read()

            # Call the parse_and_add_assets function to parse and add assets
            result = parse_and_add_assets(file_content)

            # Return a success response
            return JsonResponse({"message": result}, status=status.HTTP_200_OK)

        except UnicodeDecodeError:

            return APIResponse(
                data=[],
                message=INVALID_CSV_FILE_TYPE,
                status=status.HTTP_400_BAD_REQUEST,
            )
