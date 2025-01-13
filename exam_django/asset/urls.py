from django.urls import path
from asset.views import (
    AssetView,
    LocationView,
    AssetCountView,
    AssetTypeView,
    BusinessUnitView,
    MemoryView,
    AssignAssetView,
    AssetApproveView,
    AssetLogView,
    DataImportView,
    AssetExportView,
    UserAgentAssetView,
    AssetLifeCycleView,
    UnassignAssetView,
    DataInitialImportView,
)


urlpatterns = [
    path("", AssetView.as_view(), name="asset"),
    path("location", LocationView.as_view(), name="location"),
    path("asset_count", AssetCountView.as_view(), name="asset_count"),
    path("asset_type", AssetTypeView.as_view(), name="asset_type"),
    path("business_unit", BusinessUnitView.as_view(), name="business_unit"),
    path("memory_list", MemoryView.as_view(), name="memory_list"),
    path("assign_asset", AssignAssetView.as_view(), name="assign_asset"),
    path("approve_asset", AssetApproveView.as_view(), name="approve_asset"),
    path("asset_logs/<str:asset_uuid>", AssetLogView.as_view(), name="asset_logs"),
    path("import/", DataImportView.as_view(), name="file_import"),
    path("import/initial", DataInitialImportView.as_view(), name="initial_file_import"),
    path("export", AssetExportView.as_view(), name="export"),
    path(
        "asset_lifecycle/<str:asset_uuid>",
        AssetLifeCycleView.as_view(),
        name="asset_lifecycle",
    ),
    path("useragent", UserAgentAssetView.as_view(), name="user_agent_asset"),
    path("unassign_asset", UnassignAssetView.as_view(), name="unassign_asset"),
]
