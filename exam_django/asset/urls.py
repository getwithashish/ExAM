#exam_django/asset/urls.py

from django.urls import path
from .views import LocationView

urlpatterns = [
    
    path('location', LocationView.as_view(), name = "location")
]
