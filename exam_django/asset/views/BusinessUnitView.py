from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.serializers import BusinessUnitSerializer
from asset.models import BusinessUnit



class BusinessUnitView(ListCreateAPIView):
     def post(self, request,format = None):
        queryset = BusinessUnit.objects.all()
        serializer = BusinessUnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
     