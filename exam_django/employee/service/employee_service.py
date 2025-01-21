from asgiref.sync import sync_to_async
from typing import Dict, List, Optional
from rest_framework import status
import sentry_sdk

from employee.serializers import EmployeeSerializer
from asset.models.asset import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from employee.models.employee import Employee
from notification.service.notification_service import NotificationService
from messages import (
    CUSTODIAN_EMPLOYEE_DELETED,
    EMPLOYEE_SUCCESSFULLY_CREATED,
    EMPLOYEE_CREATION_UNSUCCESSFUL,
    GLOBAL_500_EXCEPTION_ERROR,
    EMPLOYEE_DETAILS_SUCCESSFULLY_RETRIEVED,
)


class EmployeeService:

    @staticmethod
    def retrieve_employees(query=None, is_deleted: Optional[bool] = False):
        try:
            employees = Employee.objects.filter(is_deleted=is_deleted)

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

    @staticmethod
    @sync_to_async
    def get_employees_by_object_id_async(employee_object_ids: List):
        return Employee.objects.filter(object_id__in=employee_object_ids)

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
    @sync_to_async
    def create_or_update_employees(employees: List[Employee]):
        invalid_employees: List = []
        unsynced_employees: List = []

        without_name_employees_count = 0
        employees_with_error_count = 0

        for employee in employees:
            try:
                if not employee.employee_name:
                    without_name_employees_count = without_name_employees_count + 1
                    invalid_employees.append(employee)
                    print("Employee cannot be added: ", employee)
                    continue

                employee, created = Employee.objects.update_or_create(
                    email=employee.email,
                    defaults={
                        "employee_name": employee.employee_name,
                        "employee_id": employee.employee_id,
                        "object_id": employee.object_id,
                        "mobile_phone": employee.mobile_phone,
                        "employee_department": employee.employee_department,
                        "employee_designation": employee.employee_designation,
                        "office_location": employee.office_location,
                        "is_enabled": employee.is_enabled,
                    },
                )

            except Exception as e:
                employees_with_error_count = employees_with_error_count + 1
                unsynced_employees.append(employee)
                print("Exception occured when creating an employee: ", str(e))
                sentry_sdk.capture_exception(e)
                continue

        print(
            f"Employees without name: {without_name_employees_count} and Employees with error: {employees_with_error_count}"
        )
        return (invalid_employees, unsynced_employees)

    @staticmethod
    @sync_to_async
    def soft_delete_employees(employees: List[Employee]):
        employee_ids: List = []
        employee_assets: Dict = {}
        notification_service = NotificationService()

        for employee in employees:
            employee_ids.append(employee.id)
            employee_assets[employee.id] = []

        allocated_assets = Asset.objects.filter(custodian__in=employee_ids)
        for allocated_asset in allocated_assets:
            employee_assets[allocated_asset.custodian.id].append(allocated_asset)

        for employee in employees:
            try:
                employee.is_deleted = True
                employee.save()

                if employee.id in employee_assets:
                    assets_to_deallocate = employee_assets[employee.id]
                    message = CUSTODIAN_EMPLOYEE_DELETED
                    for asset_to_deallocate in assets_to_deallocate:
                        serializer = AssetReadSerializer(asset_to_deallocate)
                        asset_dict = serializer.data.copy()
                        notification_service.send_notification(
                            subject=None, message=message, **asset_dict
                        )

            except Exception as e:
                sentry_sdk.capture_exception(e)
                print(f"Employee cannot be deleted: {employee}")
