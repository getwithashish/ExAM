#exam_django/asset/urls.py

from django.urls import path
from .views import LocationView,AssetCountView,ConcederView, AssetTypeView, BusinessUnitView,AssetSearchByNameView,AssetSearchBySerialNumberAPIView,AssetSearchByModelNumberView

urlpatterns = [
    
    path('location', LocationView.as_view(), name = "location"),
    path('asset_count',AssetCountView.as_view(),name= "asset_count"),
    path('conceder', ConcederView.as_view(), name='conceder-list'),
    path('asset_type', AssetTypeView.as_view(), name = 'asset-type'),
    path('businessunit/', BusinessUnitView.as_view(), name='businessunit'),
    path('search-asset-by-name/', AssetSearchByNameView.as_view(), name="search_asset_by_name"),
    path('search_by_serial_number/', AssetSearchBySerialNumberAPIView.as_view(), name='search_by_serial_number'),
    path('searchbymodelnumber/', AssetSearchByModelNumberView.as_view(), name='asset_search'),

]





