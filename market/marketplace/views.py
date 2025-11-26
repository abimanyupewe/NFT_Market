from decimal import Decimal
from .models import NFT, Transaction, UserProfile, CreatorProfile
from .serializers import NFTSerializer, TransactionSerializer, UserProfileSerializer, CreatorProfileSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.views.generic import TemplateView
from .form import NFTForm
import time
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

# ===== API ViewSets =====
class NFTViewSet(viewsets.ModelViewSet):
    """NFT CRUD API"""
    queryset = NFT.objects.all()
    serializer_class = NFTSerializer
    permission_classes = [AllowAny]
    
    parser_classes = [MultiPartParser, FormParser, JSONParser] 
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'creator']
    search_fields = ['title', 'description', 'creator__username', 'owner__username']
    ordering_fields = ['title', 'created_at', 'price']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        """Set creator when creating NFT"""
        if self.request.user.is_authenticated:
            serializer.save(creator=self.request.user)
        else:
            pass

    @action(detail=False, methods=['get'])
    def listed(self, request):
        nfts = NFT.objects.filter(status='listed')
        serializer = self.get_serializer(nfts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def sold(self, request):
        nfts = NFT.objects.filter(status='sold')
        serializer = self.get_serializer(nfts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def buy(self, request, pk=None):
        """Buy NFT - Create Transaction"""
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            nft = self.get_object()
            
            logger.info(f"=== BUY NFT #{nft.id} ===")
            logger.info(f"Request data: {request.data}")
            
            # Validate NFT status
            if nft.status != 'listed':
                return Response(
                    {'error': f'NFT is {nft.status}, not available for purchase'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get input
            wallet_address = request.data.get('wallet_address')
            payment_method = request.data.get('payment_method')
            
            # Validate input
            if not wallet_address or not payment_method:
                return Response(
                    {'error': 'wallet_address and payment_method are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate payment method (eth, btc, usdt)
            if payment_method not in ['eth', 'btc', 'usdt']:
                return Response(
                    {'error': f'Invalid payment_method: {payment_method}. Must be eth, btc, or usdt'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate total
            platform_fee = nft.price * Decimal('0.025')
            gas_fee = Decimal('5.00')
            total_amount = nft.price + platform_fee + gas_fee
            
            # Get creator wallet
            creator_profile = getattr(nft.creator, 'creator_profile', None)
            creator_wallet = creator_profile.wallet_address if creator_profile else "0x1234567890abcdef"
            
            # Get buyer
            from django.contrib.auth.models import User
            buyer_user = request.user if request.user.is_authenticated else User.objects.first()
            
            if not buyer_user:
                return Response(
                    {'error': 'No user available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update NFT
            nft.status = 'sold'
            nft.owner = buyer_user
            nft.save()
            
            logger.info(f"NFT #{nft.id} status updated to sold, owner: {buyer_user.username}")
            
            # Create Transaction
            transaction = Transaction.objects.create(
                nft=nft,
                transaction_type='sale',
                transaction_status='completed',
                from_user=nft.creator,
                to_user=buyer_user,
                price=total_amount,
                payment_method=payment_method,
                wallet_address=wallet_address,
                creator_wallet_address=creator_wallet,
                transaction_hash=f"tx_{nft.id}_{int(time.time())}"
            )
            
            logger.info(f"Transaction #{transaction.id} created successfully")
            
            # Ensure profiles exist
            UserProfile.objects.get_or_create(user=buyer_user, defaults={'name': buyer_user.username})
            CreatorProfile.objects.get_or_create(user=nft.creator, defaults={'name': nft.creator.username})
            
            return Response({
                'success': True,
                'message': f'Purchase completed! You are now the owner of "{nft.title}".',
                'transaction_id': transaction.id,
                'transaction_hash': transaction.transaction_hash,
                'nft_id': nft.id,
                'nft_status': nft.status,
                'total_amount': str(total_amount),
                'buyer': buyer_user.username
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error in buy action: {str(e)}", exc_info=True)
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TransactionViewSet(viewsets.ModelViewSet):
    """Transaction CRUD API"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]  # PENTING: Ubah ke AllowAny
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['transaction_status', 'transaction_type']
    search_fields = ['nft__title', 'from_user__username', 'to_user__username']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm transaction"""
        transaction = self.get_object()
        
        if transaction.from_user != request.user:
            return Response(
                {'error': 'Not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if transaction.transaction_status != 'pending':
            return Response(
                {'error': 'Transaction is not pending'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from django.utils import timezone
        transaction.transaction_status = 'completed'
        transaction.confirmed_at = timezone.now()
        transaction.save()
        
        nft = transaction.nft
        nft.owner = transaction.to_user
        nft.status = 'sold'
        nft.save()
        
        return Response({'message': 'Transaction confirmed'})


class UserProfileViewSet(viewsets.ModelViewSet):
    """User Profile CRUD API"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['user__username', 'bio']
    ordering_fields = ['created_at']
    ordering = ['-created_at']


class CreatorProfileViewSet(viewsets.ModelViewSet):
    """Creator Profile CRUD API"""
    queryset = CreatorProfile.objects.all()
    serializer_class = CreatorProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['user__username', 'name', 'bio']
    ordering_fields = ['created_at', 'total_sales']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get creator statistics"""
        total_creators = CreatorProfile.objects.count()
        total_created = NFT.objects.count()
        total_sales = Transaction.objects.filter(transaction_type='sale').count()
        
        return Response({
            'total_creators': total_creators,
            'total_created': total_created,
            'total_sales': total_sales
        })


class NFTDashboardView(TemplateView):
    template_name = 'market/nft_dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['nft_form'] = NFTForm()
        return context

class TransactionDashboardView(TemplateView):
    template_name = 'market/transaction_dashboard.html'