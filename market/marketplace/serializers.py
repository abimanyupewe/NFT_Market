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
                  'assets_count', 'total_spent', 'profile_image', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class CreatorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CreatorProfile
        fields = ['id', 'user', 'name', 'bio', 'wallet_address', 
                  'total_created', 'total_sales', 'profile_image', 
                  'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

# RegisterSerializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, write_only=True, default='customer')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'role']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        role = validated_data.pop('role', 'customer')
        validated_data.pop('confirm_password', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Create UserProfile with role
        UserProfile.objects.create(user=user, role=role, name=user.username)
        
        # If author, also create CreatorProfile
        if role == 'author':
            CreatorProfile.objects.create(user=user, name=user.username)
            
        return user
