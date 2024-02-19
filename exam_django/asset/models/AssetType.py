from django.db import models
import uuid


class AssetType(models.Model):
    asset_type_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset_type_name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.asset_type_name)
