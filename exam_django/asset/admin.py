from django.contrib import admin
from ExAM.exam_django.exam_django.exceptions import CustomMiddlewareException
from asset.models import (
    AssetType,
    BusinessUnit,
    Employee,
    Location,
    Asset,
    User,
    Memory,
    AssetLog,
)

# Register your models here.
admin.site.register(AssetType)
admin.site.register(BusinessUnit)
admin.site.register(Employee)
admin.site.register(Location)
admin.site.register(Asset)
admin.site.register(User)
admin.site.register(Memory)
admin.site.register(AssetLog)




