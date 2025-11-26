from django.urls import include, path
from . import views

app_name = 'marketplace'

urlpatterns = [
    # Admin Dashboard URLs
    path('', views.NFTDashboardView.as_view(), name='nft_dashboard'),
    path('nfts/', views.NFTDashboardView.as_view(), name='nft_list'),
    path('transactions/', views.TransactionDashboardView.as_view(), name='transaction_list'),
    
    # API URLs
    path('api/', include('marketplace.api_urls')),
]
