#exam_django/asset/urls.py

from django.urls import path
from .views import LocationView,AssetCountView,ConcederView, AssetTypeView, BusinessUnitView,AssignAssetView

urlpatterns = [
    
    path('location', LocationView.as_view(), name = "location"),
    path('asset_count',AssetCountView.as_view(),name= "asset_count"),
    path('conceder', ConcederView.as_view(), name='conceder-list'),
    path('asset_type', AssetTypeView.as_view(), name = 'asset-type'),
    path('businessunit/', BusinessUnitView.as_view(), name='businessunit'),
    # path('assets/', AssignAssetView.as_view()),
    # path('search-employee/',AssignAssetView.as_view(),name='search'),
    # path('assign-asset/', AssignAssetView.as_view(),name='assignasset'),
    path('assign-asset-to-employee/<int:asset_id>/<int:employee_id>/',AssignAssetView.as_view(), name='assign_asset_to_employee'),

]








