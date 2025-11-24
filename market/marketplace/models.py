from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver


class UserProfile(models.Model):
    """Extended user profile for NFT marketplace"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=150, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    wallet_address = models.CharField(max_length=100, blank=True)
    assets_count = models.PositiveIntegerField(default=0, help_text="Jumlah NFT yang dimiliki")
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def update_assets_count(self):
        """Update the count of NFTs owned by this user"""
        self.assets_count = NFT.objects.filter(owner=self.user).count()
        self.save(update_fields=['assets_count'])

    def __str__(self):
        return f"{self.user.username}'s profile"
    
class CreatorProfile(models.Model):
    """Profile for NFT creators"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='creator_profile')
    name = models.CharField(max_length=150, blank=True, null=True)
    total_created = models.PositiveIntegerField(default=0, help_text="Total NFT yang dibuat")
    total_sales = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, help_text="Total penjualan dalam USD")
    wallet_address = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    profile_image = models.ImageField(upload_to='creators/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def update_total_created(self):
        """Update the count of NFTs created by this user"""
        self.total_created = NFT.objects.filter(creator=self.user).count()
        self.save(update_fields=['total_created'])
    
    def update_total_sales(self):
        """Update total sales amount from transactions"""
        from django.db.models import Sum
        total = Transaction.objects.filter(
            from_user=self.user,
            transaction_type='sale'
        ).aggregate(Sum('price'))['price__sum']
        self.total_sales = total or 0
        self.save(update_fields=['total_sales'])

    def __str__(self):
        return f"{self.user.username}'s creator profile"

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
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, default="No Owner", related_name='owned_nfts')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_nfts')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    token_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    contract_address = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_owner = self.owner if self.pk else None

    def save(self, *args, **kwargs):
        # if not self.owner:
        #     self.owner = self.creator
        super().save(*args, **kwargs)
        self._original_owner = self.owner

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
    
    TRANSACTION_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHODS = [
        ('eth', 'Ethereum (ETH)'),
        ('btc', 'Bitcoin (BTC)'),
        ('usdt', 'Tether (USDT)'),
    ]

    nft = models.ForeignKey(NFT, on_delete=models.CASCADE, related_name='transactions')
    from_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sent_transactions')
    to_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='received_transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    transaction_status = models.CharField(max_length=10, choices=TRANSACTION_STATUS, default='pending')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, blank=True, null=True)
    wallet_address = models.CharField(max_length=100, blank=True, null=True)
    creator_wallet_address = models.CharField(max_length=100, blank=True, null=True, help_text="Creator's wallet address for payment")
    transaction_hash = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type} - {self.nft.title}"

# Signal handlers to automatically update assets_count
@receiver(post_save, sender=NFT)
def update_owner_assets_count_on_save(sender, instance, **kwargs):
    """Update assets count when NFT ownership changes"""
    # Update new owner's count
    if instance.owner:
        profile, created = UserProfile.objects.get_or_create(
            user=instance.owner,
            defaults={'name': instance.owner.username}
        )
        profile.update_assets_count()
    
    # If this was an ownership transfer, update previous owner's count
    if hasattr(instance, '_original_owner'):
        if instance._original_owner != instance.owner and instance._original_owner:
            try:
                old_profile = UserProfile.objects.get(user=instance._original_owner)
                old_profile.update_assets_count()
            except UserProfile.DoesNotExist:
                pass

@receiver(post_delete, sender=NFT)
def update_owner_assets_count_on_delete(sender, instance, **kwargs):
    """Update assets count when NFT is deleted"""
    if instance.owner:  # Add this check
        try:
            profile = UserProfile.objects.get(user=instance.owner)
            profile.update_assets_count()
        except UserProfile.DoesNotExist:
            pass

# Signal handlers untuk CreatorProfile
@receiver(post_save, sender=NFT)
def update_creator_stats_on_nft_save(sender, instance, created, **kwargs):
    """Update creator's total_created when NFT is created"""
    if created:
        creator_profile, _ = CreatorProfile.objects.get_or_create(
            user=instance.creator,
            defaults={'name': instance.creator.username}
        )
        creator_profile.update_total_created()

@receiver(post_delete, sender=NFT)
def update_creator_stats_on_nft_delete(sender, instance, **kwargs):
    """Update creator's total_created when NFT is deleted"""
    try:
        creator_profile = CreatorProfile.objects.get(user=instance.creator)
        creator_profile.update_total_created()
    except CreatorProfile.DoesNotExist:
        pass

@receiver(post_save, sender=Transaction)
def update_creator_sales_on_transaction(sender, instance, created, **kwargs):
    """Update creator's total_sales when sale transaction occurs"""
    if created and instance.transaction_type == 'sale' and instance.from_user:
        creator_profile, _ = CreatorProfile.objects.get_or_create(
            user=instance.from_user,
            defaults={'name': instance.from_user.username}
        )
        creator_profile.update_total_sales()

@receiver(post_delete, sender=Transaction)
def update_creator_sales_on_transaction_delete(sender, instance, **kwargs):
    """Update creator's total_sales when transaction is deleted"""
    if instance.transaction_type == 'sale' and instance.from_user:
        try:
            creator_profile = CreatorProfile.objects.get(user=instance.from_user)
            creator_profile.update_total_sales()
        except CreatorProfile.DoesNotExist:
            pass