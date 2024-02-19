from django.urls import include, path
from asset.views import BusinessUnitView,EmployeeView
from .views import *


urlpatterns=[

    path('businessunit/', BusinessUnitView.as_view(),name='businessunit')
]
