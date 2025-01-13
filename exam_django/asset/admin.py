from django.contrib import admin
from asset.models import (
    AssetType,
    BusinessUnit,
    Location,
    Asset,
    Memory,
    AssetLog,
)

# Register your models here.
admin.site.register(AssetType)
admin.site.register(BusinessUnit)
admin.site.register(Location)
admin.site.register(Asset)
admin.site.register(Memory)
admin.site.register(AssetLog)
