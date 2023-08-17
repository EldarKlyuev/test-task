from django.contrib import admin
from django.urls import path
from app.views import *

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/allroads/', get_all_roads),
    path('api/v1/road/<int:road_code>/', get_only_one_road),
    path('api/v1/azs-for/<int:road_code>/', get_azs_for),
]
