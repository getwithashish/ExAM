from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user_auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "password",
            "email",
            "first_name",
            "last_name",
            "mobile",
            "user_scope",
            "username",
        )
        extra_kwargs = {
            "username": {"required": True},
            "password": {"write_only": True, "required": True},
            "email": {"required": True},
            # "mobile": {"required": True},
            "user_scope": {"required": True},
        }


class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "mobile",
            "user_scope",
            "username",
            "status",
            "is_deleted",
            "created_at",
            "updated_at",
        )


class UsernameAndUserscopeTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token payload
        token["user_id"] = user.id
        token["username"] = user.username
        token["user_scope"] = user.user_scope
        token["full_name"] = f"{user.first_name} {user.last_name}"

        return token
