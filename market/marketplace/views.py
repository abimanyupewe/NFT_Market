from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView
from django.contrib import messages
from decimal import Decimal
from .models import NFT, Transaction, UserProfile, CreatorProfile
from .form import PurchaseForm, OfferForm, NFTForm, UserProfileForm, CreatorProfileForm
from .serializers import NFTSerializer, TransactionSerializer, UserProfileSerializer, CreatorProfileSerializer
from rest_framework import viewsets


def home(request):
    featured_nfts = NFT.objects.filter(status='listed')[:4]
    recent_transactions = Transaction.objects.all()[:5]

    # Tambahkan data untuk infografis component
    total_assets = NFT.objects.filter(status='listed').count()
    total_creators = CreatorProfile.objects.count()

    context = {
        'featured_nfts': featured_nfts,
        'recent_transactions': recent_transactions,
        'total_assets': total_assets,
        'total_creators': total_creators,
    }
    return render(request, 'marketplace/home.html', context)


class NFTListView(ListView):
    """List all NFTs"""
    model = NFT
    template_name = 'marketplace/nft_list.html'
    context_object_name = 'nfts'
    paginate_by = 12

    def get_queryset(self):
        return NFT.objects.filter(status='listed')


class NFTDetailView(DetailView):
    """Detail view for a single NFT"""
    model = NFT
    context_object_name = 'nft'

    def get_template_names(self):
        """Return different templates based on NFT status"""
        if self.object.status == 'sold':
            return ['marketplace/nft_detail_.html']
        return ['marketplace/nft_detail.html']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        if self.object.status == 'sold':
            # For sold NFTs - show completed transactions and pending offers
            context['transactions'] = self.object.transactions.filter(transaction_status='completed')[:10]
            
            # Show pending offers only to the owner
            if self.request.user == self.object.owner:
                context['pending_offers'] = self.object.transactions.filter(
                    transaction_status='pending',
                    transaction_type='sale'
                )
        else:
            # For listed/draft NFTs - show all transactions
            context['transactions'] = self.object.transactions.all()[:10]
        
        return context


def buy_nft(request, nft_id):
    nft = get_object_or_404(NFT, id=nft_id)
    platform_fee = nft.price * Decimal('0.025')  # 2.5% platform fee
    gas_fee = Decimal('5.00')  # Fixed gas fee
    total_amount = nft.price + platform_fee + gas_fee
    
    # Get creator's wallet address from CreatorProfile
    creator_profile = getattr(nft.creator, 'creator_profile', None)
    creator_wallet = creator_profile.wallet_address if creator_profile and creator_profile.wallet_address else "0x1234567890abcdef1234567890abcdef12345678"
    
    form = PurchaseForm()
    
    context = {
        'nft': nft,
        'platform_fee': platform_fee,
        'gas_fee': gas_fee,
        'total_amount': total_amount,
        'creator_wallet': creator_wallet,
        'form': form,
    }
    return render(request, 'marketplace/transaction.html', context)

def process_purchase(request, nft_id):
    if request.method == 'POST':
        nft = get_object_or_404(NFT, id=nft_id)
        form = PurchaseForm(request.POST)
        
        # Check if NFT is still available
        if nft.status != 'listed':
            messages.error(request, 'This NFT is no longer available for purchase.')
            return redirect('marketplace:nft_detail', pk=nft_id)
        
        if form.is_valid():
            wallet_address = form.cleaned_data['wallet_address']
            payment_method = form.cleaned_data['payment_method']
            
            # Create transaction record with pending status
            platform_fee = nft.price * Decimal('0.025')
            gas_fee = Decimal('5.00')
            total_amount = nft.price + platform_fee + gas_fee
            
            # Get creator's wallet address from CreatorProfile
            creator_profile = getattr(nft.creator, 'creator_profile', None)
            creator_wallet = creator_profile.wallet_address if creator_profile and creator_profile.wallet_address else "0x1234567890abcdef1234567890abcdef12345678"
            
            transaction = Transaction.objects.create(
                nft=nft,
                transaction_type='sale',
                transaction_status='pending',
                from_user=nft.owner,
                to_user=request.user,
                price=total_amount,
                payment_method=payment_method,
                wallet_address=wallet_address,
                creator_wallet_address=creator_wallet,
                transaction_hash=f"tx_{nft_id}_{request.user.id}"
            )
            
            # Ensure profiles exist
            UserProfile.objects.get_or_create(user=request.user)
            CreatorProfile.objects.get_or_create(
                user=nft.creator,
                defaults={'name': nft.creator.username}
            )
            
            messages.success(request, f'Purchase request submitted for "{nft.title}"! Please send payment to the creator\'s wallet address. The creator will confirm the transaction.')
            return redirect('marketplace:nft_detail', pk=nft_id)
        else:
            messages.error(request, 'Please correct the errors in the form.')
            return redirect('marketplace:buy_nft', nft_id=nft_id)
    
    return redirect('marketplace:buy_nft', nft_id=nft_id)

def confirm_transaction(request, transaction_id):
    """View for creator to confirm payment received"""
    transaction = get_object_or_404(Transaction, id=transaction_id)
    
    # Only creator can confirm
    if request.user != transaction.nft.creator:
        messages.error(request, 'You are not authorized to confirm this transaction.')
        return redirect('marketplace:nft_detail', pk=transaction.nft.id)
    
    if request.method == 'POST' and transaction.transaction_status == 'pending':
        from django.utils import timezone
        
        # Update transaction status
        transaction.transaction_status = 'completed'
        transaction.confirmed_at = timezone.now()
        transaction.save()
        
        # Now transfer ownership
        nft = transaction.nft
        nft.owner = transaction.to_user
        nft.status = 'sold'
        nft.save()
        
        messages.success(request, f'Transaction confirmed! "{nft.title}" has been transferred to {transaction.to_user.username}.')
        return redirect('marketplace:nft_detail', pk=nft.id)
    
    return redirect('marketplace:nft_detail', pk=transaction.nft.id)

class SoldNFTListView(ListView):
    """List all sold NFTs"""
    model = NFT
    template_name = 'marketplace/sold_nft_list.html'
    context_object_name = 'nfts'
    paginate_by = 12

    def get_queryset(self):
        return NFT.objects.filter(status='sold')

# Api View
class NFTViewSet(viewsets.ModelViewSet):
    queryset = NFT.objects.all()
    serializer_class = NFTSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    
class CreatorProfileViewSet(viewsets.ModelViewSet):
    queryset = CreatorProfile.objects.all()
    serializer_class = CreatorProfileSerializer

def infografis(request):
    total_assets = NFT.objects.count()
    total_creators = CreatorProfile.objects.count()
    context = {
        "total_assets": total_assets,
        "total_creators": total_creators,
    }
    return render(request, "marketplace/components/infografis.html", context)

# Utility functions
def user_owned_assets_count(user):
    """Count NFTs owned by a specific user"""
    return NFT.objects.filter(owner=user).count()

def total_marketplace_assets():
    """Count total NFTs listed in marketplace"""
    return NFT.objects.filter(status='listed').count()