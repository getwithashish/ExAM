from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
import sentry_sdk
from social_django.utils import load_strategy, load_backend
from social_core.exceptions import AuthTokenError

from response import APIResponse
from user_auth.service.sso_service.sso_callback_service import SSOCallbackService
from user_auth.service.sso_service.user_details_service.microsoft_sso_user_details_service import (
    MicrosoftSSOUserDetailsService,
)
from user_auth.serializers.user_serializer import (
    UsernameAndUserscopeTokenObtainPairSerializer,
)


class UsernameAndUserscopeTokenObtainPairView(TokenObtainPairView):
    serializer_class = UsernameAndUserscopeTokenObtainPairSerializer


class SSOLogin(generics.GenericAPIView):

    def get(self, request, provider):
        strategy = load_strategy(request)
        backend = load_backend(
            strategy,
            provider,
            redirect_uri=settings.SOCIAL_CALLBACK_URL.format(provider),
        )
        auth_url = backend.auth_url()
        return APIResponse(status=status.HTTP_302_FOUND, headers={"Location": auth_url})


class SSOCallback(generics.GenericAPIView):
    def get(self, request, provider):

        sso_user_details_service = None
        global_config = settings.GLOBAL_CONFIG

        code = request.query_params.get("code")

        # TODO IdPs like github do not have the option to set user_scope. So, such IdPs should be avoided.
        # TODO Proceed after SSO is given

        if not code:
            return APIResponse(
                status=status.HTTP_302_FOUND,
                headers={"Location": global_config["global"]["hostname"]},
            )

        if provider == "azuread-oauth2":
            sso_user_details_service = MicrosoftSSOUserDetailsService()

        try:
            return SSOCallbackService.handle_sso_callback(
                provider=provider,
                request=request,
                sso_user_details_service=sso_user_details_service,
            )

        except AuthTokenError as e:
            sentry_sdk.capture_exception(e)
            return APIResponse(
                status=status.HTTP_302_FOUND,
                headers={"Location": global_config["global"]["hostname"]},
            )
