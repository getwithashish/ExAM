from django.urls import path
from .views import SearchAssetBySerialNumberAPIView

urlpatterns = [
    path('search-by-serial-number/', SearchAssetBySerialNumberAPIView.as_view(), name='search_by_serial_number'),
    
]
