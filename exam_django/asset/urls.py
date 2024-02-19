from django.urls import path
from .views import AssetTypeView, UserView

urlpatterns = [
    path('asset_type', AssetTypeView.as_view(), name = 'asset-type'),
    path('user', UserView.as_view(), name = 'user')
]