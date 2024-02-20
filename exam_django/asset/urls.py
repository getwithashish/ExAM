#exam_django/asset/urls.py

from django.urls import path
from .views import LocationView,AssetCountView,ConcederView, AssetTypeView, BusinessUnitView,EmployeeView

urlpatterns = [
    
    path('location', LocationView.as_view(), name = "location"),
    path('asset_count',AssetCountView.as_view(),name= "asset_count"),
    path('conceder', ConcederView.as_view(), name='conceder-list'),
    path('businessunit/', BusinessUnitView.as_view(), name='businessunit'),
    path('employee/', EmployeeView.as_view(),name='employeeview')


]





