# exam_django/asset/views/LocationView.py

from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.models import Location
from asset.serializers import LocationSerializer


class LocationView(ListCreateAPIView):
    def post(self, request):
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("successfully inserted", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
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
            # Return the serialized data in the response
            return Response(serializer.data)

        except Exception:
            return Response("Sorry, we encountered an error",
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
