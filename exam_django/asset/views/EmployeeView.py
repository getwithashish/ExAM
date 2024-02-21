from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.serializers import EmployeeSerializer
from asset.models import Employee


class EmployeeView(ListCreateAPIView):
    def post(self, request, format=None):
        queryset = Employee.objects.all()
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        businessUnit = Employee.objects.all()
        serializer = EmployeeSerializer(businessUnit, many=True)
        return Response(serializer.data)
