from django.urls import path
from request.views import RequestView,RequestApprovalUpdateView

urlpatterns = [
    path("requests/", RequestView.as_view(), name="requestapprove"),
    path("requests-put/", RequestApprovalUpdateView.as_view(), name="request_detail")
]
