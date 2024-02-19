from django.contrib import admin
from .models import Location,Asset,User

# Register your models here.
admin.site.register(Location)
admin.site.register(Asset)
admin.site.register(User)