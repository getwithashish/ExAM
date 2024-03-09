from django.db import models


class AssetType(models.Model):

    asset_type_name = models.CharField(max_length=50, null=False, blank=False)

    def __str__(self):
        return str(self.asset_type_name)
