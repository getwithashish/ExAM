from django.urls import path
from asset.views import SearchAssetByNameView
from .views import *


urlpatterns = [

    path('search-asset-by-name/', SearchAssetByNameView.as_view(), name="search_asset_by_name"),

]