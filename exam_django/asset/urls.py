from django.urls import path
from .views import AssetTypeView

urlpatterns = [
    path('asset_type', AssetTypeView.as_view(), name = 'asset-type')
]