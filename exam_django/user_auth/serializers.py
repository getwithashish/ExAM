from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate

from user_auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
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

    def create(self, validated_data):
        if "username" not in validated_data:
            raise ValidationError({"username": "This field is required"})
        return User.objects.create_user(**validated_data)


class UsernameAndUserscopeTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token payload
        token["user_id"] = user.id
        token["username"] = user.username
        token["user_scope"] = user.user_scope

        return token

class SSOTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token payload
        token["user_id"] = user.id
        token["username"] = user.username
        token["user_scope"] = user.user_scope

        return token
    
    def validate(self, attrs):
        email = attrs.get("email")

        if email:
            user = authenticate(request=self.context.get('request'), email=email)
        else:
            raise serializers.ValidationError("Must include 'email'.")

        if not user:
            raise serializers.ValidationError("Unable to log in with provided credentials.")

        refresh = self.get_token(user)

        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return data
