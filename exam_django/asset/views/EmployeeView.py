from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.serializers import EmployeeSerializer
from asset.models import Employee
from rest_framework.permissions import IsAuthenticated
from response import APIResponse
from messages import (
    EMPLOYEE_SUCCESSFULLY_CREATED,
    EMPLOYEE_CREATION_UNSUCCESSFUL,
    GLOBAL_500_EXCEPTION_ERROR,
    EMPLOYEE_DETAILS_SUCCESSFULLY_RETRIEVED,
)


class EmployeeView(ListCreateAPIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        elif self.request.method == "POST":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request, format=None):
        data = {}
        try:
            queryset = Employee.objects.all()
            serializer = EmployeeSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return APIResponse(
                    data=serializer.data,
                    message=EMPLOYEE_SUCCESSFULLY_CREATED,
                    status=status.HTTP_201_CREATED,
                )
            return APIResponse(
                data=serializer.errors,
                message=EMPLOYEE_CREATION_UNSUCCESSFUL,
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return APIResponse(
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get(self, request):
        try:
            # Get the query parameter for the employee name
            name = request.query_params.get('name', None)
            if name:
                # Search for employees by name
                employees = Employee.objects.filter(employee_name__istartswith=name)
                serializer = EmployeeSerializer(employees, many=True)
                message = f"Employee details with name containing '{name}' successfully retrieved"
            else:
                employees = (
                    Employee.objects.all()
                )  

            serializer = EmployeeSerializer(employees, many=True)
            return APIResponse(
                data=serializer.data,
                message=EMPLOYEE_DETAILS_SUCCESSFULLY_RETRIEVED,
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return APIResponse(
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
