from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from asset.views.CsvFileImportView import parse_and_add_assets
from user_auth.rbac import IsLead
from response import APIResponse
from messages import INVALID_CSV_FILE_TYPE, FILE_NOT_FOUND
import jwt  # Import JWT library
from user_auth.models import User  # Import the User model


class DataImportView(APIView):
    permission_classes = (IsLead,)

    def post(self, request, format=None):
        try:
            # Extract JWT token from request headers
            jwt_token = request.headers.get("Authorization").split(" ")[1]
            print(jwt_token)

            # Ensure jwt_token is of type bytes
            jwt_token_bytes = jwt_token.encode("utf-8")
            print(jwt_token_bytes)

            # Extract username directly from the token payload
            payload = jwt.decode(jwt_token_bytes, algorithms=["none"], options={"verify_signature": False})
            username = payload.get("username")
            print(username)

            # Query the database to get the corresponding User object
            user = User.objects.get(username=username)

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
            result = parse_and_add_assets(file_content, user)

            # Return a success response
            return JsonResponse({"message": result}, status=status.HTTP_200_OK)

        except UnicodeDecodeError:
            return APIResponse(
                data=[],
                message=INVALID_CSV_FILE_TYPE,
                status=status.HTTP_400_BAD_REQUEST,
            )
