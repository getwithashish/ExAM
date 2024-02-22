from django.urls import path
from request.views import RequestApprovalView

urlpatterns = [
    path("requests/", RequestApprovalView.as_view(), name="requestapprove"),
    path("requests/<str:pk>/", RequestApprovalView.as_view(), name="request_detail"),
]
