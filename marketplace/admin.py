from django.contrib import admin
from .models import UserProfile, NFT, Transaction


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'wallet_address', 'created_at']
    search_fields = ['user__username', 'wallet_address']
    list_filter = ['created_at']


@admin.register(NFT)
class NFTAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'creator', 'price', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'description', 'owner__username', 'creator__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['nft', 'transaction_type', 'from_user', 'to_user', 'price', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['nft__title', 'from_user__username', 'to_user__username', 'transaction_hash']
    readonly_fields = ['created_at']
