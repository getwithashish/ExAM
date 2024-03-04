from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from user_auth.views import UserRegistrationView
from asset.views.UserView import index

urlpatterns = [
    path("signin", TokenObtainPairView.as_view(), name="jwt_signin"),
    path("token/refresh", TokenRefreshView.as_view(), name="jwt_refresh"),
    path("register", UserRegistrationView.as_view(), name="jwt_signup"),
    path("checkPerm", index, name="index_resp")
    
]
