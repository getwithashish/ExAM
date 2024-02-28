from django.urls import path
from asset.views import (
    AssetView,
    LocationView,
    AssetCountView,
    ConcederView,
    AssetTypeView,
    BusinessUnitView,
    # AssetSearchByNameView,
    # AssetSearchBySerialNumberAPIView,
    # AssetSearchByModelNumberView,
    # AssetSearchByAssetIDView,
    MemoryView,
    EmployeeView,
    AssignAssetView,
    AssetSearchWithFilterView
)


urlpatterns = [
    path("", AssetView.as_view(), name="asset"),
    path("location", LocationView.as_view(), name="location"),
    path("asset_count", AssetCountView.as_view(), name="asset_count"),
    path("conceder", ConcederView.as_view(), name="conceder-list"),
    path("asset_type", AssetTypeView.as_view(), name="asset-type"),
    path("business_unit", BusinessUnitView.as_view(), name="businessunit"),
    path("memory_list", MemoryView.as_view(), name="memory_list"),
    path("employee", EmployeeView.as_view(), name="employeeview"),
    path("assign_asset", AssignAssetView.as_view(), name="assignasset"),
    path("search", AssetSearchWithFilterView.as_view(), name="search"),






    
]
