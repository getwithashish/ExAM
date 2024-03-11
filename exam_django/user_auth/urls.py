from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from user_auth.views import (
    UserRegistrationView,
    UserRetrievalView,
    UsernameAndUserscopeTokenObtainPairView,
)
from asset.views.UserView import index

urlpatterns = [
    path("", UserRetrievalView.as_view(), name="getUsers"),
    # path("signin", TokenObtainPairView.as_view(), name="jwt_signin"),
    path("signin", UsernameAndUserscopeTokenObtainPairView.as_view(), name="jwt_signin"),
    path("token/refresh", TokenRefreshView.as_view(), name="jwt_refresh"),
    path("register", UserRegistrationView.as_view(), name="jwt_signup"),
    path("checkPerm", index, name="index_resp"),
]
