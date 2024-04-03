from asset.models import BusinessUnit
from asset.serializers import BusinessUnitSerializer
from messages import (
    BUSINESS_UNIT_SUCCESSFULLY_CREATED,
    BUSINESS_UNIT_CREATED_UNSUCCESSFUL,
    GLOBAL_500_EXCEPTION_ERROR,
    BUSINESS_UNIT_SUCCESSFULLY_RETRIEVED,
)
from rest_framework import status


class BusinessUnitService:

    @staticmethod
    def create_business_unit(data):
        serializer = BusinessUnitSerializer(data=data)
        message_success = BUSINESS_UNIT_SUCCESSFULLY_CREATED
        message_failure = BUSINESS_UNIT_CREATED_UNSUCCESSFUL
        if serializer.is_valid():
            business_unit = serializer.save()
            serialized_business_unit = BusinessUnitSerializer(business_unit).data
            return serialized_business_unit, message_success, status.HTTP_201_CREATED
        return serializer.errors, message_failure, status.HTTP_400_BAD_REQUEST

    @staticmethod
    def retrieve_business_units(query=None):
        try:
            business_units = BusinessUnit.objects.all()
            message_success = BUSINESS_UNIT_SUCCESSFULLY_RETRIEVED
            search_query = query

            if search_query:
                business_units = business_units.filter(
                    business_unit_name__istartswith=search_query
                )

            serializer = BusinessUnitSerializer(business_units, many=True)
            return serializer.data, message_success, status.HTTP_200_OK
        except Exception as e:
            return (
                str(e),
                GLOBAL_500_EXCEPTION_ERROR,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
