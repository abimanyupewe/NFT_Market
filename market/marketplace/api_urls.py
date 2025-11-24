from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NFTViewSet, TransactionViewSet, UserProfileViewSet, CreatorProfileViewSet

router = DefaultRouter()
router.register(r'nfts', NFTViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'creator-profiles', CreatorProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]