import json
from django.db import models


class Location(models.Model):

    location_name = models.CharField(
        max_length=50, null=False, blank=False, unique=True
    )

    def __str__(self):
        return json.dumps({"id": self.id, "location_name": self.location_name})

    class Meta:
        ordering = ["id"]
