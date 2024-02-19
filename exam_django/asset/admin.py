from django.contrib import admin
from asset.models import Asset,AssetType,Employee,Location,BusinessUnit

# Register your models here.
admin.site.register(Asset)
admin.site.register(AssetType)
admin.site.register(Employee)
admin.site.register(Location)
admin.site.register(BusinessUnit)
