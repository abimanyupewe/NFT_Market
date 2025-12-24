from django.contrib import admin
from .models import CreatorProfile, UserProfile, NFT, Transaction
from unfold.admin import ModelAdmin

class UserProfileAdmin(ModelAdmin):
    list_display = ['user', 'wallet_address', 'role', 'created_at', 'updated_at']
    search_fields = ['user__username', 'wallet_address']
    list_filter = ['created_at', 'updated_at']

class CreatorProfileAdmin(ModelAdmin):
    list_display = ['user', 'total_created', 'total_sales', 'created_at', 'updated_at']
    search_fields = ['user__username']
    list_filter = ['created_at', 'updated_at']

class NFTAdmin(ModelAdmin):
    list_display = ['title', 'owner', 'creator', 'price', 'status', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at', 'updated_at']
    search_fields = ['title', 'description', 'owner__username', 'creator__username']
    readonly_fields = ['created_at', 'updated_at']


class TransactionAdmin(ModelAdmin):
    list_display = ['nft', 'transaction_type', 'from_user', 'to_user', 'price', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['nft__title', 'from_user__username', 'to_user__username', 'transaction_hash']
    readonly_fields = ['created_at']

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(CreatorProfile, CreatorProfileAdmin)
admin.site.register(NFT, NFTAdmin)
admin.site.register(Transaction, TransactionAdmin)