import json
from django.db import models


class BusinessUnit(models.Model):

    business_unit_name = models.CharField(
        max_length=255, null=False, blank=False, unique=True
    )

    def __str__(self):
        return json.dumps(
            {"id": self.id, "business_unit_name": self.business_unit_name}
        )
