from rest_framework import status
from asset.models import Location
from asset.serializers import LocationSerializer
from messages import (
    LOCATION_RETRIEVED_SUCCESSFULLY,
    LOCATION_CREATED_SUCCESSFULLY,
    GLOBAL_500_EXCEPTION_ERROR,
    LOCATION_CREATION_FAILED,
    LOCATION_RETRIEVAL_FAILED,
)


class LocationService:
    serializer_class = LocationSerializer  # Define the serializer_class attribute

    @staticmethod
    def create_location(data):
        try:
            serializer = LocationSerializer(data=data)
            message_success = LOCATION_CREATED_SUCCESSFULLY
            message_failure = LOCATION_CREATION_FAILED
            if serializer.is_valid():
                location = serializer.save()
                serialized_location = LocationSerializer(location).data
                return serialized_location, message_success, status.HTTP_201_CREATED
            return serializer.errors, message_failure, status.HTTP_400_BAD_REQUEST
        except Exception:
            return (
                serializer.errors,
                GLOBAL_500_EXCEPTION_ERROR,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def retrieve_location(query=None):
        try:
            location = Location.objects.all()
            message_success = LOCATION_RETRIEVED_SUCCESSFULLY
            message_failure = LOCATION_RETRIEVAL_FAILED
            search_query = query

            if search_query:
                location = location.filter(location_name__istartswith=search_query)
            serializer = LocationSerializer(location, many=True)
            return serializer.data, message_success, status.HTTP_200_OK

        except Exception as e:
            return (
                str(e),
                message_failure,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
