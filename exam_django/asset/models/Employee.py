from django.db import models


class Employee(models.Model):
    employee_uuid = models.UUIDField(primary_key=True, editable=False)
    employee_name = models.CharField(max_length=255, null=False, blank=False)
    employee_department = models.CharField(max_length=255, null=False,
                                           blank=False)
    employee_designation = models.CharField(max_length=255, null=False,
                                            blank=False)
