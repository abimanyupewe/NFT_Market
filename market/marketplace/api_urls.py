from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NFTViewSet, 
    TransactionViewSet, 
    UserProfileViewSet, 
    CreatorProfileViewSet,
    AuthViewSet
)

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'nfts', NFTViewSet, basename='nft')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'user-profiles', UserProfileViewSet, basename='userprofile')
router.register(r'creator-profiles', CreatorProfileViewSet, basename='creatorprofile')

urlpatterns = [
    path('', include(router.urls)),
]