from django.db import models
import uuid


class Location(models.Model):
    location_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4,
                                     editable=False, unique=True)
    location_name = models.CharField(max_length=50, null=False, blank=False)

    def __str__(self):
        return str(self.location_name)  # Return a meaningful representation of the object
