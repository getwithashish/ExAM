import json
from django.db import models


class AssetType(models.Model):

    asset_type_name = models.CharField(
        max_length=50, null=False, blank=False, unique=True
    )

    def __str__(self):
        return json.dumps({"id": self.id, "asset_type_name": self.asset_type_name})
