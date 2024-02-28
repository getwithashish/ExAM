from django.db import models


class Employee(models.Model):

    employee_name = models.CharField(max_length=255, null=False, blank=False)
    employee_department = models.CharField(max_length=255, null=False, blank=False)
    employee_designation = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return str(self.employee_name)
