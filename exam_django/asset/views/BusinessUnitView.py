from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from asset.serializers import BusinessUnitSerializer
from asset.models import BusinessUnit
from response import APIResponse
from messages import (
    BUSINESS_UNIT_SUCCESSFULLY_CREATED,
    BUSINESS_UNIT_CREATED_UNSUCCESSFUL,
    GLOBAL_500_EXCEPTION_ERROR,
    BUSINESS_UNIT_SUCCESSFULLY_RETRIEVED,
)


class BusinessUnitView(ListCreateAPIView):
    serializer_class = BusinessUnitSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        elif self.request.method == "POST":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request, format=None):
        try:
            serializer = BusinessUnitSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return APIResponse(
                    data=serializer.data,
                    message=BUSINESS_UNIT_SUCCESSFULLY_CREATED,
                    status=status.HTTP_201_CREATED,
                )
            return APIResponse(
                data=serializer.errors,
                message=BUSINESS_UNIT_CREATED_UNSUCCESSFUL,
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return APIResponse(
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get(self, request):
        try:
            business_units = BusinessUnit.objects.all()

            # Retrieve query parameters
            search_query = request.GET.get("query", None)

            # Filter queryset based on search query
            if search_query:
                business_units = business_units.filter(
                    business_unit_name__istartswith=search_query
                )

            serializer = BusinessUnitSerializer(business_units, many=True)
            return APIResponse(
                data=serializer.data,
                message=BUSINESS_UNIT_SUCCESSFULLY_RETRIEVED,
                status=status.HTTP_200_OK,
            )
        except Exception:
            return APIResponse(
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
