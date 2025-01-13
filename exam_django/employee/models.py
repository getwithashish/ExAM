import json
from django.db import models


class Employee(models.Model):

    employee_name = models.CharField(max_length=100, null=False, blank=False)
    employee_id = models.CharField(max_length=10, null=False, blank=False)
    email = models.EmailField(
        max_length=100,
        # null=False,
        null=True,
        blank=False,
        unique=True,
        default="experion@experion.com",
        verbose_name="email address",
    )
    mobile_phone = models.CharField(max_length=20, null=True, blank=False)
    employee_department = models.CharField(max_length=100, null=True, blank=False)
    employee_designation = models.CharField(max_length=50, null=True, blank=False)
    office_location = models.CharField(max_length=50, null=True, blank=False)
    is_enabled = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return json.dumps({"id": self.id, "employee_name": self.employee_name})
