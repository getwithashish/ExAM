import json
from datetime import timedelta
from enum import Enum
from typing import Dict, List, Optional

from django.conf import settings
from django.utils import timezone

from employee.client.azuread.azuread_client import AzureAD_Client
from employee.service.employee_service import EmployeeService
from employee.models.employee_sync_history import EmployeeSyncHistory
from employee.service.employee_sync_history_service import EmployeeSyncHistoryService
from employee.client.employee_data_source_client_abstract import (
    EmployeeDataSourceClientAbstract,
)
from messages import SYNC_DELTA_METADATA_NOT_FOUND, SYNC_INTERVAL_NOT_OVER


global_config = settings.GLOBAL_CONFIG


class EmployeeDataSourceToLocalSynchronizationService:

    def __init__(self):
        self.employee_data_source = global_config["employee"]["data_source"]
        self.refresh_interval_seconds = global_config["employee"][
            "refresh_interval_seconds"
        ]
        self.employee_sync_history_service = EmployeeSyncHistoryService

    async def synchronize_employees(
        self,
        is_initial_sync: bool,
        current_employee_sync: EmployeeSyncHistory,
        employee_data_source_class: EmployeeDataSourceClientAbstract,
        delta_metadata: Optional[
            Dict
        ] = None,  # delta_metadata is optional for initial sync
    ):
        invalid_employees: List = []
        unsynced_employees: List = []

        # Save new sync history entry
        await self.employee_sync_history_service.save_employee_sync_history_async(
            employee_sync=current_employee_sync
        )

        if is_initial_sync:
            async for (
                employees_in_batch,
                sync_metadata,
            ) in employee_data_source_class.retrieve_users():
                invalid_employees_in_batch, unsynced_employees_in_batch = (
                    await EmployeeService.create_or_update_employees(
                        employees=employees_in_batch
                    )
                )
        else:
            async for (
                deleted_employees_in_batch,
                created_or_updated_employees_in_batch,
                sync_metadata,
            ) in employee_data_source_class.get_user_changes(
                delta_metadata=delta_metadata
            ):
                invalid_employees_in_batch, unsynced_employees_in_batch = (
                    await EmployeeService.create_or_update_employees(
                        employees=created_or_updated_employees_in_batch
                    )
                )

                await EmployeeService.soft_delete_employees(
                    employees=deleted_employees_in_batch
                )

        if sync_metadata:
            current_employee_sync.additional_data = json.dumps(sync_metadata)

        invalid_employees.append(invalid_employees_in_batch)
        unsynced_employees.append(unsynced_employees_in_batch)

        return (invalid_employees, unsynced_employees, current_employee_sync)

    async def sync_local_source(self):
        employee_data_source_class = EmployeeDataSource[self.employee_data_source].value

        invalid_employees: List = []
        unsynced_employees: List = []
        current_employee_sync: EmployeeSyncHistory = EmployeeSyncHistory(
            remote_source=self.employee_data_source
        )

        try:
            latest_employee_sync = await self.employee_sync_history_service.retrieve_employee_sync_history_async(
                latest=True
            )
            time_interval = timezone.now() - latest_employee_sync.started_at

            if time_interval <= timedelta(seconds=self.refresh_interval_seconds):
                print(SYNC_INTERVAL_NOT_OVER)
                return (invalid_employees, unsynced_employees)

            # None is returned if additional_data is not found
            delta_metadata_raw: Dict = (
                await self.employee_sync_history_service.get_latest_valid_delta_metadata_async(
                    sync_history=latest_employee_sync
                )
            )
            if not delta_metadata_raw:
                raise EmployeeSyncHistory.DoesNotExist(SYNC_DELTA_METADATA_NOT_FOUND)

            delta_metadata: Dict = json.loads(delta_metadata_raw)

            invalid_employees, unsynced_employees, current_employee_sync = (
                await self.synchronize_employees(
                    is_initial_sync=False,
                    current_employee_sync=current_employee_sync,
                    employee_data_source_class=employee_data_source_class,
                    delta_metadata=delta_metadata,
                )
            )

        except EmployeeSyncHistory.DoesNotExist:
            invalid_employees, unsynced_employees, current_employee_sync = (
                await self.synchronize_employees(
                    is_initial_sync=True,
                    current_employee_sync=current_employee_sync,
                    employee_data_source_class=employee_data_source_class,
                )
            )

        current_employee_sync.ended_at = timezone.now()
        await self.employee_sync_history_service.save_employee_sync_history_async(
            employee_sync=current_employee_sync
        )

        return (invalid_employees, unsynced_employees)


class EmployeeDataSource(Enum):

    AZURE_AD = AzureAD_Client
