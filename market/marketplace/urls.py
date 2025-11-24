from django.urls import include, path
from . import views

app_name = 'marketplace'

urlpatterns = [
    path('', views.home, name='home'),
    path('nfts/', views.NFTListView.as_view(), name='nft_list'),
    path('nfts/<int:pk>/', views.NFTDetailView.as_view(), name='nft_detail'),
    path('buy/<int:nft_id>/', views.buy_nft, name='buy_nft'),
    path('process-purchase/<int:nft_id>/', views.process_purchase, name='process_purchase'),
    path('confirm-transaction/<int:transaction_id>/', views.confirm_transaction, name='confirm_transaction'),
    path('sold-nfts/', views.SoldNFTListView.as_view(), name='sold_nfts'),

    path('api/', include('marketplace.api_urls')), # URL untuk API
]
