from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from response import APIResponse
from asset.service.business_unit_crud_service.business_unit_service import (
    BusinessUnitService,
)
from asset.serializers import BusinessUnitSerializer
from rest_framework import status


class BusinessUnitView(ListCreateAPIView):
    serializer_class = BusinessUnitSerializer

    def get_permissions(self):
        if self.request.method == "GET" or self.request.method == "POST":
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request, format=None):
        data = request.data
        business_unit, message, http_status = BusinessUnitService.create_business_unit(
            data
        )
        return APIResponse(data=business_unit, message=message, status=http_status)

    def get(self, request, format=None):
        search_query = request.GET.get("query", None)
        business_units, message, http_status = (
            BusinessUnitService.retrieve_business_units(search_query)
        )
        return APIResponse(data=business_units, message=message, status=http_status)











