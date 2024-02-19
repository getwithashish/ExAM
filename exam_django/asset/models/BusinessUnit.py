from django.db import models
import uuid

class BusinessUnit(models.Model):
    bu_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bu_name = models.CharField(max_length=255,null=False,blank=False)

    def __str__(self):
        return str(self.bu_name)



