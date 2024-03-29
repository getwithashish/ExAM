from django.urls import path
from asset.views import (
    AssetView,
    AssetUpdateView,
    LocationView,
    AssetCountView,
    AssetTypeView,
    BusinessUnitView,
    MemoryView,
    EmployeeView,
    AssignAssetView,
    AssetApproveView,
    AssetSearchWithFilterView,
    AssetLogView,
    DataImportView,
    AssetExportView,
    UserAgentAssetView,
    QueryBuilderView,
)


urlpatterns = [
    path("", AssetView.as_view(), name="asset"),
    path("update", AssetUpdateView.as_view(), name="asset_update"),
    path("location", LocationView.as_view(), name="location"),
    path("asset_count", AssetCountView.as_view(), name="asset_count"),
    path("asset_type", AssetTypeView.as_view(), name="asset_type"),
    path("business_unit", BusinessUnitView.as_view(), name="business_unit"),
    path("memory_list", MemoryView.as_view(), name="memory_list"),
    path("employee", EmployeeView.as_view(), name="employee_view"),
    path("assign_asset", AssignAssetView.as_view(), name="assign_asset"),
    path("approve_asset", AssetApproveView.as_view(), name="approve_asset"),
    path("search", AssetSearchWithFilterView.as_view(), name="search"),
    path("asset_logs/<str:asset_uuid>", AssetLogView.as_view(), name="asset_logs"),
    path("import-csv/", DataImportView.as_view(), name="csv_file_import"),
    path("export", AssetExportView.as_view(), name="export"),
    path("queryBuilder", QueryBuilderView.as_view(), name="queryBuilder"),
    path("useragent", UserAgentAssetView.as_view(), name="user_agent_asset"),
]
