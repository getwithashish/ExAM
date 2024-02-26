# exam_django/asset/views/LocationView.py

from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.models import Location
from asset.serializers import LocationSerializer


class LocationView(ListCreateAPIView):
    def post(self, request, format=None):
        Location.objects.all()
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("successfully inserted", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):

        try:
            locations = Location.objects.all()
            # Serialize the queryset
            serializer = LocationSerializer(locations, many=True)
            # Return the serialized data in the response
            return Response(serializer.data)

        except Exception as e:
            return Response("sorry , we found an error", e)
