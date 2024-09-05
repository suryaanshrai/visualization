from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("uploadnewdata", views.uploadnewdata, name="uploadnewdata"),
    path("getEntireData", views.getEntireData, name="getEntireData"),
    path("filter", views.filter, name="filter"),
    path("getSourceName", views.getSourceName, name="getSourceName"),
]