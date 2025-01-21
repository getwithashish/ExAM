import asyncio
from django.core.management.base import BaseCommand

from employee.service.employee_data_source_to_local_synchronization_service import (
    EmployeeDataSourceToLocalSynchronizationService,
)


class Command(BaseCommand):
    help = "Sync Employee Data from remote data source to local database"

    def handle(self, *args, **kwargs):
        asyncio.run(self.sync_employee_data())

    async def sync_employee_data(self):
        employee_data_source_to_local_sync_service = (
            EmployeeDataSourceToLocalSynchronizationService()
        )
        invalid_employees, unsynced_employees = (
            await employee_data_source_to_local_sync_service.sync_local_source()
        )

        if invalid_employees or unsynced_employees:
            self.stdout.write(
                self.style.WARNING(f"Employees with invalid data: {invalid_employees}")
            )
            self.stdout.write(
                self.style.WARNING(f"Employees unable to sync: {unsynced_employees}")
            )

        self.stdout.write(self.style.SUCCESS("Finished syncing employee data"))
