from django.contrib import admin

from employee.models.employee import Employee
from employee.models.employee_sync_history import EmployeeSyncHistory


admin.site.register(Employee)
admin.site.register(EmployeeSyncHistory)
