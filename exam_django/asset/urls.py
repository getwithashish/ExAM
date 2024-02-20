from django.urls import path, include
from asset.views import AssetTypeView, BusinessUnitView

urlpatterns = [
    path('asset_type', AssetTypeView.as_view(), name = 'asset-type'),
    path('businessunit/', BusinessUnitView.as_view(), name='businessunit')
]
