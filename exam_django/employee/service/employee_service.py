from rest_framework import status

from employee.models import Employee
from employee.serializers import EmployeeSerializer
from messages import (
    EMPLOYEE_SUCCESSFULLY_CREATED,
    EMPLOYEE_CREATION_UNSUCCESSFUL,
    GLOBAL_500_EXCEPTION_ERROR,
    EMPLOYEE_DETAILS_SUCCESSFULLY_RETRIEVED,
)


class EmployeeService:

    @staticmethod
    def create_employee(data):
        serializer = EmployeeSerializer(data=data)

        if serializer.is_valid():
            employee = serializer.save()
            serialized_employee = EmployeeSerializer(employee).data
            return (
                serialized_employee,
                EMPLOYEE_SUCCESSFULLY_CREATED,
                status.HTTP_201_CREATED,
            )

        return (
            serializer.errors,
            EMPLOYEE_CREATION_UNSUCCESSFUL,
            status.HTTP_406_NOT_ACCEPTABLE,
        )

    @staticmethod
    def retrieve_employees(query=None):
        try:
            employees = Employee.objects.all()

            if query:
                employees = employees.filter(employee_name__istartswith=query)

            serializer = EmployeeSerializer(employees, many=True)

            return (
                serializer.data,
                EMPLOYEE_DETAILS_SUCCESSFULLY_RETRIEVED,
                status.HTTP_200_OK,
            )

        except Exception as e:
            return (
                str(e),
                GLOBAL_500_EXCEPTION_ERROR,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
