from django.db import models

from asset.models.AbstractAssetModel import AbstractAssetModel


class AssetLog(AbstractAssetModel):

    asset_uuid = models.ForeignKey(
        "Asset", on_delete=models.CASCADE, null=False, blank=False
    )
    asset_log_timestamp = models.DateTimeField(auto_now_add=True)
