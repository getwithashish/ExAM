from asset.models import Employee
from asset.serializers import EmployeeSerializer
from response import APIResponse
from messages import (
    EMPLOYEE_SUCCESSFULLY_CREATED,
    EMPLOYEE_CREATION_UNSUCCESSFUL,
    GLOBAL_500_EXCEPTION_ERROR,
    EMPLOYEE_DETAILS_SUCCESSFULLY_RETRIEVED,
    EMPLOYEE_DETAILS_FOUND
)
from rest_framework import status


class EmployeeService:
    @staticmethod
    def create_employee(data):
        serializer = EmployeeSerializer(data=data)
        message_success = EMPLOYEE_SUCCESSFULLY_CREATED
        message_failure = EMPLOYEE_CREATION_UNSUCCESSFUL
        if serializer.is_valid():
            employee = serializer.save()
            serialized_employee = EmployeeSerializer(employee).data
            return serialized_employee, message_success, status.HTTP_201_CREATED
        return serializer.errors, message_failure, status.HTTP_400_BAD_REQUEST

    @staticmethod
    def retrieve_employees(query=None):
        try:
            if query:
                employees = Employee.objects.filter(employee_name__istartswith=query)
                message = EMPLOYEE_DETAILS_FOUND
            else:
                employees = Employee.objects.all()
                message = EMPLOYEE_DETAILS_SUCCESSFULLY_RETRIEVED

            serializer = EmployeeSerializer(employees, many=True)
            return serializer.data, message, status.HTTP_200_OK
        except Exception as e:
            return (
                str(e),
                GLOBAL_500_EXCEPTION_ERROR,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
