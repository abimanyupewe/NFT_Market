from rest_framework import serializers
from django.contrib.auth.models import User
from .models import NFT, Transaction, UserProfile, CreatorProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class NFTSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    creator = UserSerializer(read_only=True)
    
    class Meta:
        model = NFT
        fields = ['id', 'title', 'description', 'image', 'price', 'status', 
                  'owner', 'creator', 'token_id', 'contract_address', 
                  'created_at', 'updated_at']
        read_only_fields = ['token_id', 'contract_address', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    nft = NFTSerializer(read_only=True)
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'nft', 'transaction_type', 'transaction_status', 
                  'from_user', 'to_user', 'price', 'payment_method', 
                  'wallet_address', 'creator_wallet_address', 'transaction_hash', 
                  'created_at', 'confirmed_at']
        read_only_fields = ['created_at', 'confirmed_at']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'name', 'bio', 'wallet_address', 
                  'assets_count', 'profile_image', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class CreatorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CreatorProfile
        fields = ['id', 'user', 'name', 'bio', 'wallet_address', 
                  'total_created', 'total_sales', 'profile_image', 
                  'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
