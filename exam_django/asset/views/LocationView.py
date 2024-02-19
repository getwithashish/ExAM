#exam_django/asset/views/LocationView.py

from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from asset.models import Location
from rest_framework import status
from rest_framework.response import Response
import LocationSerializer

"""retrieve locations from location model, """

class LocationView(ListCreateAPIView):
     def post(self, request, format=None):
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)