from django.urls import path

from employee.views import EmployeeView


urlpatterns = [
    path("employee", EmployeeView.as_view(), name="employee_view"),
]
