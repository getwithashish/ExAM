# exam_django/asset/views/LocationView.py

from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.models import Location
from asset.serializers import LocationSerializer
from rest_framework.permissions import IsAuthenticated
from response import APIResponse
from messages import (
    LOCATION_RETRIEVED_SUCCESSFULLY,
    LOCATION_CREATED_SUCCESSFULLY,
    LOCATION_RETRIEVAL_FAILED,
)


class LocationView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return APIResponse(
                data=[],
                message=LOCATION_CREATED_SUCCESSFULLY,
                status=status.HTTP_200_OK,
            )
        return APIResponse(
            data=[],
            message=LOCATION_RETRIEVAL_FAILED,
            status=status.HTTP_400,
        )

    def get(self, request):
        try:
            query = request.query_params.get("query")
            if query:
                locations = Location.objects.filter(location_name__istartswith=query)
            else:
                locations = Location.objects.all()

            # Paginate the queryset
            page = self.paginate_queryset(locations)
            if page is not None:
                # Serialize the paginated queryset
                serializer = LocationSerializer(page, many=True)
                # Return the paginated response
                return self.get_paginated_response(serializer.data)

            # Serialize the queryset
            serializer = LocationSerializer(locations, many=True)
            return Response(
                data=serializer.data,
                message=LOCATION_RETRIEVED_SUCCESSFULLY,
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                "Sorry, we encountered an error",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
