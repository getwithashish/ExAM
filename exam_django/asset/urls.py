from django.urls import path, include
from asset.views import AssetTypeView, BusinessUnitView, LocationView

urlpatterns = [
    path('asset_type', AssetTypeView.as_view(), name = 'asset-type'),
    path('businessunit/', BusinessUnitView.as_view(), name='businessunit'),
    path('location', LocationView.as_view(), name = "location")
]
