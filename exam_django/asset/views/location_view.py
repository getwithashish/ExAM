# exam_django/asset/views/LocationView.py

from asset.service.location_crud_service.location_service import LocationService
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from response import APIResponse


class LocationView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        if self.request.method == "GET" or self.request.method == "POST":
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request, format=None):
        data = request.data
        location, message, http_status = LocationService.create_location(data)
        return APIResponse(data=location, message=message, status=http_status)

    def get(self, request):
        search_query = request.GET.get("query", None)
        location, message, http_status = LocationService.retrieve_location(search_query)
        return APIResponse(data=location, message=message, status=http_status)
