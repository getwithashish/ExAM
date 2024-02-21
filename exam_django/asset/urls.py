#exam_django/asset/urls.py

from django.urls import path
from .views import LocationView,AssetCountView,ConcederView, AssetTypeView, BusinessUnitView,AssetSearchByAssetIDView

urlpatterns = [
    
    path('location', LocationView.as_view(), name = "location"),
    path('asset_count',AssetCountView.as_view(),name= "asset_count"),
    path('conceder', ConcederView.as_view(), name='conceder-list'),
     path('asset_type', AssetTypeView.as_view(), name = 'asset-type'),
    path('businessunit/', BusinessUnitView.as_view(), name='businessunit'),
    path('asset_search_by_id/', AssetSearchByAssetIDView.as_view(), name='asset_search_by_asset_id'),

]





