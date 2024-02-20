from django.urls import path
from asset.views import MemoryView
from .views import *


urlpatterns = [

    path('memory-list', MemoryView.as_view(), name="memory_list"),

]
