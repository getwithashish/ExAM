from django.urls import path
from asset.views import (
    AssetView,
    LocationView,
    AssetCountView,
    AssetTypeView,
    BusinessUnitView,
    MemoryView,
    EmployeeView,
    AssignAssetView,
    AssetSearchWithFilterView,
    AssetLogView
)


urlpatterns = [
    path("", AssetView.as_view(), name="asset"),
    path("location", LocationView.as_view(), name="location"),
    path("asset_count", AssetCountView.as_view(), name="asset_count"),
    path("asset_type", AssetTypeView.as_view(), name="asset-type"),
    path("business_unit", BusinessUnitView.as_view(), name="businessunit"),
    path("memory_list", MemoryView.as_view(), name="memory_list"),
    path("employee", EmployeeView.as_view(), name="employeeview"),
    path("assign_asset", AssignAssetView.as_view(), name="assignasset"),
    path("search", AssetSearchWithFilterView.as_view(), name="search"),
    path("asset_logs/<str:asset_uuid>", AssetLogView.as_view(), name="asset_logs"),
  
]
