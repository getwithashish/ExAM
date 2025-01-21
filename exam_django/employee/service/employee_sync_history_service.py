from typing import Optional
from asgiref.sync import sync_to_async

from employee.models.employee_sync_history import EmployeeSyncHistory


class EmployeeSyncHistoryService:

    @staticmethod
    @sync_to_async
    def retrieve_employee_sync_history_async(latest: bool = False):
        if latest:
            return EmployeeSyncHistory.objects.latest("started_at")

        return EmployeeSyncHistory.objects.all()

    @staticmethod
    @sync_to_async
    def save_employee_sync_history_async(employee_sync: EmployeeSyncHistory):
        employee_sync.save()

    @staticmethod
    @sync_to_async
    def get_latest_valid_delta_metadata_async(
        sync_history: Optional[EmployeeSyncHistory] = None,
    ):

        if not sync_history:
            sync_history = EmployeeSyncHistory.objects.latest("started_at")

        while sync_history and sync_history.additional_data is None:
            previous_sync_history = (
                EmployeeSyncHistory.objects.filter(
                    started_at__lt=sync_history.started_at
                )
                .order_by("-started_at")
                .first()
            )

            if not previous_sync_history:
                return None

            sync_history = previous_sync_history

        if sync_history and sync_history.additional_data:
            return sync_history.additional_data
