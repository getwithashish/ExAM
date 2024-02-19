#exam_django/asset/urls.py

from django.urls import path
from .views import LocationView,AssetCountView,ConcederView

urlpatterns = [
    
    path('location', LocationView.as_view(), name = "location"),
    path('asset_count',AssetCountView.as_view(),name= "asset_count"),
    path('conceder', ConcederView.as_view(), name='conceder-list'),

]



