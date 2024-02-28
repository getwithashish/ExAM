from django.db import models
import uuid

from asset.models.AbstractAssetModel import AbstractAssetModel


class Asset(AbstractAssetModel):
    asset_uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True
    )
