from rest_framework import serializers
from rest_framework.exceptions import ValidationError

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
            "mobile": {"required": True},
            "user_scope": {"required": True},
        }

    def create(self, validated_data):
        if "username" not in validated_data:
            raise ValidationError({"username": "This field is required"})
        return User.objects.create_user(**validated_data)
