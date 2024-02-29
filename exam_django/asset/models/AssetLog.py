from django.db import models


class AssetLog(models.Model):

    asset_uuid = models.ForeignKey(
        "Asset", on_delete=models.CASCADE, null=False, blank=False
    )
    asset_log = models.JSONField(null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)






