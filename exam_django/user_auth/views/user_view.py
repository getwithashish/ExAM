from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
import sentry_sdk

from user_auth.serializers.user_serializer import UserReadSerializer
from user_auth.service.user_service.django_user_service.django_user_mutation_service import (
    DjangoUserMutationService,
)
from exceptions import ValidationException
from user_auth.service.user_service.django_user_service.django_user_query_service import (
    DjangoUserQueryService,
)
from user_auth.serializers.user_serializer import (
    UserSerializer,
)
from response import APIResponse
from messages import (
    GLOBAL_500_EXCEPTION_ERROR,
    USER_CREATED_SUCCESSFULLY,
    USERS_RETRIEVED_SUCCESSFULLY,
)


class UserRetrievalView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_name = self.request.query_params.get("name")

        user_query_service = DjangoUserQueryService()
        serializer = user_query_service.get_user_data(user_name=user_name)

        return APIResponse(
            data=serializer.data,
            message=USERS_RETRIEVED_SUCCESSFULLY,
            status=status.HTTP_200_OK,
        )


class UserRegistrationView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            user_data = request.data
            user = DjangoUserMutationService.create_user(user_data=user_data)

            user_read_serializer = UserReadSerializer(user)

            return APIResponse(
                data=user_read_serializer.data,
                message=USER_CREATED_SUCCESSFULLY,
                status=status.HTTP_201_CREATED,
            )

        except ValidationException as ve:
            sentry_sdk.capture_exception(ve)
            return APIResponse(
                data=str(ve),
                message=ve.message,
                status=ve.status,
            )

        except Exception as ex:
            sentry_sdk.capture_exception(ex)
            return APIResponse(
                data=str(ex),
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
