from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile for NFT marketplace"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    wallet_address = models.CharField(max_length=100, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class NFT(models.Model):
    """NFT item model"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('listed', 'Listed'),
        ('sold', 'Sold'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='nfts/')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_nfts')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_nfts')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    token_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    contract_address = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Transaction(models.Model):
    """Transaction history for NFT purchases"""
    TRANSACTION_TYPES = [
        ('mint', 'Mint'),
        ('sale', 'Sale'),
        ('transfer', 'Transfer'),
    ]

    nft = models.ForeignKey(NFT, on_delete=models.CASCADE, related_name='transactions')
    from_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sent_transactions')
    to_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='received_transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    transaction_hash = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type} - {self.nft.title}"
