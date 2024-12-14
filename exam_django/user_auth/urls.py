from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from user_auth.views.sso_view import (
    SSOCallback,
    SSOLogin,
    UsernameAndUserscopeTokenObtainPairView,
)
from user_auth.views.user_view import UserRegistrationView, UserRetrievalView


urlpatterns = [
    path("", UserRetrievalView.as_view(), name="getUsers"),
    # path("signin", TokenObtainPairView.as_view(), name="jwt_signin"),
    path(
        "signin", UsernameAndUserscopeTokenObtainPairView.as_view(), name="jwt_signin"
    ),
    path("token/refresh", TokenRefreshView.as_view(), name="jwt_refresh"),
    path("register", UserRegistrationView.as_view(), name="jwt_signup"),
    path("auth/sso-login/<str:provider>", SSOLogin.as_view(), name="sso-login"),
    path("auth/sso/<str:provider>", SSOCallback.as_view(), name="sso_callback"),
]
