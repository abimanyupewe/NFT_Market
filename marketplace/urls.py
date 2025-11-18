from django.urls import path
from . import views

app_name = 'marketplace'

urlpatterns = [
    path('', views.home, name='home'),
    path('nfts/', views.NFTListView.as_view(), name='nft_list'),
    path('nfts/<int:pk>/', views.NFTDetailView.as_view(), name='nft_detail'),
]
