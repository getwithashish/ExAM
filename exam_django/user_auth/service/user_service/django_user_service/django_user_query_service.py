from typing import Optional
from user_auth.serializers.user_serializer import UserSerializer

from user_auth.models import User


class DjangoUserQueryService:

    @staticmethod
    def get_user_data(
        user_name: Optional[str] = None,
        user_scope: Optional[str] = None,
        is_deleted: bool = False,
    ):
        queryset = User.objects.filter(is_deleted=is_deleted)

        if user_name:
            queryset = (
                queryset.filter(first_name__icontains=user_name)
                | queryset.filter(last_name__icontains=user_name)
                | queryset.filter(username__icontains=user_name)
            )

        if user_scope:
            queryset = queryset.filter(user_scope=user_scope)

        serializer = UserSerializer(queryset, many=True)

        return serializer
