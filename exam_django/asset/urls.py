from django.urls import path
from asset.views import MemoryList
from .views import *


urlpatterns = [

    path('memory-list', MemoryList.as_view(), name="memory_list"),

]
