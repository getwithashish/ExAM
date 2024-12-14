from django.conf import settings
from django.shortcuts import redirect
from social_django.utils import load_strategy, load_backend
from rest_framework.response import Response
from rest_framework import status

from user_auth.serializers.user_serializer import (
    UsernameAndUserscopeTokenObtainPairSerializer,
)

from messages import USER_NOT_ACTIVE, USER_SCOPE_NOT_FOUND
from exceptions import UserNotActiveException, UserScopeNotFoundException


global_config = settings.GLOBAL_CONFIG


class SSOCallbackService:

    @staticmethod
    def handle_sso_callback(provider, request, sso_user_details_service):
        strategy = load_strategy(request)
        backend = load_backend(
            strategy,
            provider,
            redirect_uri=settings.SOCIAL_CALLBACK_URL.format(provider),
        )
        user = backend.complete(
            user=None, request=request, code=request.query_params.get("code")
        )

        if user:
            (user_scopes,) = sso_user_details_service.get_sso_user_details(user=user)
            mapped_user_scope = SSOCallbackService.map_user_scope(
                user_scopes=user_scopes
            )

            if user.user_scope != mapped_user_scope:
                user.user_scope = mapped_user_scope
                user.save()

            if user.is_active and not user.is_deleted:
                tokens = SSOCallbackService.obtain_tokens(user)
            else:
                raise UserNotActiveException(
                    {}, USER_NOT_ACTIVE, status.HTTP_403_FORBIDDEN
                )

            redirect_url = global_config["sso"]["redirect_url"]
            redirect_url_with_tokens = redirect_url.format(
                tokens["refresh"], tokens["access"]
            )

            return redirect(redirect_url_with_tokens)

        else:
            return Response(
                status=status.HTTP_302_FOUND,
                headers={"Location": global_config["global"]["hostname"]},
            )

    @staticmethod
    def map_user_scope(user_scopes):
        mapped_user_scopes = set()
        user_scope_manager_in_application = global_config["model_data"]["user"][
            "application"
        ]["user_scope_manager"]
        user_scope_lead_in_application = global_config["model_data"]["user"][
            "application"
        ]["user_scope_lead"]
        user_scope_sysadmin_in_application = global_config["model_data"]["user"][
            "application"
        ]["user_scope_sysadmin"]

        for user_scope in user_scopes:
            # Return the user scope immediately since this is the user scope with highest privilege
            if (
                user_scope.upper()
                in global_config["model_data"]["user"]["client"]["user_scope_manager"]
            ):
                mapped_user_scopes.add(user_scope_manager_in_application)
                break

            elif (
                user_scope.upper()
                in global_config["model_data"]["user"]["client"]["user_scope_lead"]
            ):
                mapped_user_scopes.add(user_scope_lead_in_application)

            elif (
                user_scope.upper()
                in global_config["model_data"]["user"]["client"]["user_scope_sysadmin"]
            ):
                mapped_user_scopes.add(user_scope_sysadmin_in_application)

        if user_scope_manager_in_application in mapped_user_scopes:
            user_scope = user_scope_manager_in_application

        elif user_scope_lead_in_application in mapped_user_scopes:
            user_scope = user_scope_lead_in_application

        elif user_scope_sysadmin_in_application in mapped_user_scopes:
            user_scope = user_scope_sysadmin_in_application

        else:
            raise UserScopeNotFoundException(
                {}, USER_SCOPE_NOT_FOUND, status.HTTP_404_NOT_FOUND
            )

        return user_scope

    @staticmethod
    def obtain_tokens(user):
        tokens = UsernameAndUserscopeTokenObtainPairSerializer.get_token(user)
        refresh_token = str(tokens)
        access_token = str(tokens.access_token)

        return {
            "refresh": str(refresh_token),
            "access": str(access_token),
        }
