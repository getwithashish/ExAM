from django.urls import include, path
from asset.views import EmployeeView
from .views import *



urlpatterns=[

    path('employee/',EmployeeView.as_view(),name='employee')
]