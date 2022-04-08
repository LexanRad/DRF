from django.urls import path
from .views import UserGenericViewSet

app_name = 'users'
urlpatterns = [
    path('', UserGenericViewSet.as_view({'get': 'list'})),
]
