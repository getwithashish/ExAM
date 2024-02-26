from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.serializers import EmployeeSerializer
from asset.models import Employee



    
class EmployeeView(ListCreateAPIView):
    def post(self, request, format=None):
        data = {}
        try:
            queryset = Employee.objects.all()
            serializer = EmployeeSerializer(data=request.data)
           
            if serializer.is_valid():
                serializer.save()
                return Response({"data": serializer.data, "message": "Employee successfully created"}, status=status.HTTP_201_CREATED)
            data['error'] = "Invalid request_status"
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def get(self, request):
        try:
            employees = Employee.objects.all()
            serializer = EmployeeSerializer(employees, many=True)
            return Response({"data": serializer.data, "message": "Employee details successfully retrieved"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
