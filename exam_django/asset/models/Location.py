from django.db import models


class Location(models.Model):

    location_name = models.CharField(
        max_length=50, null=False, blank=False, unique=True
    )

    def __str__(self):
        return str(self.location_name)

    # Return a meaningful representation of the object

    class Meta:
        ordering = ["id"]
        # Specify default ordering by location_uuid
