import jwt
import secrets
import string
from django.shortcuts import redirect
from rest_framework import generics, status
from rest_framework.response import Response
from user_auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from user_auth.serializers import (
    UsernameAndUserscopeTokenObtainPairSerializer,
    UserSerializer,
)
from django.db.models import Q
from rest_framework.permissions import AllowAny, IsAuthenticated
from response import APIResponse
from messages import (
    USERS_RETRIEVED_SUCCESSFULLY,
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
                Q(first_name__icontains=query_param)
                | Q(last_name__icontains=query_param)
                | Q(username__icontains=query_param)
            )

        serializer = UserSerializer(queryset, many=True)
        return APIResponse(
            data=serializer.data,
            message=USERS_RETRIEVED_SUCCESSFULLY,
            status=status.HTTP_200_OK,
        )
        # Return queryset as a response


class UserRegistrationView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request):  # Add 'request' as an argument
        queryset = User.objects.all()

        # Check if a query parameter is provided
        query_param = self.request.query_params.get("name")
        if query_param:
            queryset = (
                queryset.filter(first_name__icontains=query_param)
                | queryset.filter(last_name__icontains=query_param)
                | queryset.filter(username__icontains=query_param)
            )

        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)  # Return queryset as a response

    def post(self, request):
        # TODO can use create_user_service here. Contains the same logic
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
                    "message": "Something went wrong",
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


class UsernameAndUserscopeTokenObtainPairView(TokenObtainPairView):
    serializer_class = UsernameAndUserscopeTokenObtainPairSerializer


class SSOCreateRetrieveView(generics.GenericAPIView):

    def get(self, request):
        # TODO Check whether jwt is valid
        payload = jwt.decode(
            request.identity_context_data._access_token,
            options={"verify_signature": False},
            algorithms=["RS256"],
        )

        # TODO username in User model is now unique and necessary. Need to change that
        # TODO Need to rethink this flow and logic

        upn = payload["upn"]
        username = upn.split("@")[0]
        user_scope = username.split(".")[2]

        if (
            user_scope.upper() == "SYSADMIN"
            or user_scope.upper() == "SENIORADMINISTRATOR"
        ):
            user_scope = "SYSTEM_ADMIN"
        elif user_scope.upper() == "LEAD" or user_scope.upper() == "SENIORLEAD":
            user_scope = "LEAD"
        elif user_scope.upper() == "MANAGER":
            user_scope = "MANAGER"
        else:
            print("Some other user scope encountered !!!!")
            return

        try:
            user = User.objects.get(email=upn)
            tokens = obtain_tokens(user)

        except User.DoesNotExist:
            randPass = generate_random_password()
            user_data = {
                "username": username,
                "password": randPass,
                "email": upn,
                "user_scope": user_scope,
            }
            user = create_user_service(user_data)
            if user:
                tokens = obtain_tokens(user)
            else:
                print("Something happened")
                return

        redirect_url = f"http://localhost:5173/sso/flow?refresh_token={tokens['refresh']}&access_token={tokens['access']}"
        return redirect(redirect_url)


def generate_random_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation

    password = "".join(secrets.choice(characters) for _ in range(length))

    return password


def obtain_tokens(user):
    tokens = UsernameAndUserscopeTokenObtainPairSerializer.get_token(user)
    refresh_token = str(tokens)
    access_token = str(tokens.access_token)

    return {
        "refresh": str(refresh_token),
        "access": str(access_token),
    }


def create_user_service(user_data):
    try:
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return user
        else:
            err_data = str(serializer.errors)
            print(err_data)
            return None

    except Exception as ex:
        print(ex)
        return None
