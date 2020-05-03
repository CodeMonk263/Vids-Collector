from django.urls import path
from . import views
from .viewsets import *

# urlpatterns = [
#     path('api/get_links/', views.links_list),
# ]

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', DualSerializerViewSet, basename='get_links')
urlpatterns = router.urls