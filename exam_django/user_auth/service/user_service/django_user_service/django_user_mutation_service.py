from rest_framework import status

from messages import BAD_REQUEST_ERROR
from exceptions import ValidationException
from user_auth.serializers.user_serializer import UserSerializer


class DjangoUserMutationService:

    @staticmethod
    def create_user(user_data):
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return user

        else:
            raise ValidationException(
                errors=str(serializer.errors),
                message=BAD_REQUEST_ERROR,
                status=status.HTTP_400_BAD_REQUEST,
            )
