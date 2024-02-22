from django.db import models
import uuid


class BusinessUnit(models.Model):
    business_unit_uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    business_unit_name = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return str(self.business_unit_name)
