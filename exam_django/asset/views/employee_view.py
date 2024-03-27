from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from response import APIResponse

from asset.service.employee_crud_service.employee_service import EmployeeService
from asset.serializers import EmployeeSerializer
from rest_framework import status


class EmployeeView(ListCreateAPIView):
    serializer_class = EmployeeSerializer

    def get_permissions(self):
        if self.request.method == "GET" or self.request.method == "POST":
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request, format=None):
        data = request.data
        employee, message, http_status = EmployeeService.create_employee(data)
        return APIResponse(data=employee, message=message, status=http_status)

    def get(self, request, format=None):
        name = request.query_params.get("name", None)
        employees, message, http_status = EmployeeService.retrieve_employees(name)
        return APIResponse(data=employees, message=message, status=http_status)


