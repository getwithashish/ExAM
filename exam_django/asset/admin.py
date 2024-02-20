from django.contrib import admin
from asset.models import AssetType, User, Asset

# Register your models here.
admin.site.register(AssetType)
admin.site.register(User)
admin.site.register(Asset)