from django.shortcuts import render

from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from user_auth.serializers import RegisterSerializer


class UserRegistrationView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                # user.save()
                # Success part of the code # Single line dictionary for response with info logs
                # UserProfileSerializer(user, context=self.get_serializer_context()).data, }

                res_data = {
                    "success": True,
                    "message": "Registration Successful, Please Login",
                    "data": {"id": user.id, "username": user.username},
                }
                return Response(res_data, status=status.HTTP_201_CREATED)
            else:
                # Error handling part of the code # Single line dictionary for response with error logs
                err_data = str(serializer.errors)
                res_data = {
                    "success": False,
                    "message": "Something weBnt wrong",
                    "data": {"error": err_data},
                }
                return Response(res_data, status=status.HTTP_400_BAD_REQUEST)

        except Exception as ex:
            # Exception handling part of the code # Single line dictionary for response with error logs
            res_data = {
                "success": False,
                "message": " Something went wrong !",
                "data": {"error": str(ex)},
            }
            return Response(res_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
