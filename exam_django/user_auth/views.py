from rest_framework import generics, status
from rest_framework.response import Response
from user_auth.models import User
from user_auth.serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from response import APIResponse
from messages import (
    ASSET_CREATED_UNSUCCESSFUL,
    ASSET_LIST_RETRIEVAL_UNSUCCESSFUL,
    ASSET_LIST_SUCCESSFULLY_RETRIEVED,
    ASSET_SUCCESSFULLY_CREATED,
)


class UserRetrievalView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):  # Add 'request' as an argument
        queryset = User.objects.all()

        # Check if a query parameter is provided
        query_param = self.request.query_params.get("name")
        if query_param:
            queryset = queryset.filter(
                first_name__icontains=query_param
            ) | queryset.filter(last_name__icontains=query_param)

        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)  # Return queryset as a response


class UserRegistrationView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                res_data = {
                    "success": True,
                    "message": "Registration Successful, Please Login",
                    "data": {"id": user.id, "username": user.username},
                }
                return Response(res_data, status=status.HTTP_201_CREATED)
            else:
                err_data = str(serializer.errors)
                res_data = {
                    "success": False,
                    "message": "Something weBnt wrong",
                    "data": {"error": err_data},
                }
                return Response(res_data, status=status.HTTP_400_BAD_REQUEST)

        except Exception as ex:
            res_data = {
                "success": False,
                "message": " Something went wrong !",
                "data": {"error": str(ex)},
            }
            return Response(res_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
