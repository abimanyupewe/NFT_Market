from django.views.generic.base import TemplateView
from decimal import Decimal
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
import time
import logging

from .models import NFT, Transaction, UserProfile, CreatorProfile
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    NFTSerializer, TransactionSerializer, UserProfileSerializer, 
    CreatorProfileSerializer, RegisterSerializer
)
from .form import NFTForm

logger = logging.getLogger(__name__)

# ===== Auth ViewSet =====
class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for Authentication (Login & Register)
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email,
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = AuthTokenSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            # Get user role
            try:
                role = user.profile.role
            except:
                role = 'customer'

            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email,
                'role': role
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===== API ViewSets =====
class NFTViewSet(viewsets.ModelViewSet):
    """NFT CRUD API"""
    queryset = NFT.objects.all()
    serializer_class = NFTSerializer
    permission_classes = [IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'creator', 'owner']
    search_fields = ['title', 'description', 'creator__username', 'owner__username']
    ordering_fields = ['title', 'created_at', 'price']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        """Set creator when creating NFT"""
        if self.request.user.is_authenticated:
            serializer.save(creator=self.request.user, owner=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def listed(self, request):
        """Get listed NFTs"""
        nfts = self.queryset.filter(status='listed')
        serializer = self.get_serializer(nfts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def sold(self, request):
        """Get sold NFTs"""
        nfts = self.queryset.filter(status='sold')
        serializer = self.get_serializer(nfts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def upcoming(self, request):
        """Get upcoming (pre-listing) NFTs ordered by listing date"""
        nfts = self.queryset.filter(status='pre_listing').order_by('listing_date')
        serializer = self.get_serializer(nfts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def buy(self, request, pk=None):
        """Buy NFT - Create Transaction"""
        try:
            nft = self.get_object()
            logger.info(f"Purchase request for NFT #{nft.id}")
            
            # Validate NFT availability
            if nft.status != 'listed':
                return Response(
                    {'error': f'NFT is {nft.status}, not available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get and validate input
            wallet_address = request.data.get('wallet_address')
            payment_method = request.data.get('payment_method')
            
            if not wallet_address or not payment_method:
                return Response(
                    {'error': 'wallet_address and payment_method required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if payment_method not in ['eth', 'btc', 'usdt']:
                return Response(
                    {'error': f'Invalid payment_method: {payment_method}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate total amount
            total_amount = nft.price + (nft.price * Decimal('0.025')) + Decimal('5.00')
            
            # Get buyer (authenticated user or first user as fallback)
            buyer_user = request.user if request.user.is_authenticated else User.objects.first()
            if not buyer_user:
                return Response({'error': 'No user available'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get creator wallet
            creator_profile = getattr(nft.creator, 'creator_profile', None)
            creator_wallet = creator_profile.wallet_address if creator_profile else "0x1234567890abcdef"
            
            # Update NFT status
            nft.status = 'sold'
            nft.owner = buyer_user
            nft.save()
            
            # Create Transaction record
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
            
            # Ensure user profiles exist
            buyer_profile, _ = UserProfile.objects.get_or_create(user=buyer_user, defaults={'name': buyer_user.username})
            creator_profile_obj, _ = CreatorProfile.objects.get_or_create(user=nft.creator, defaults={'name': nft.creator.username})
            
            # Update stats
            buyer_profile.update_assets_count()
            buyer_profile.update_total_spent()
            
            creator_profile_obj.update_total_sales()
            creator_profile_obj.update_total_created()
            
            logger.info(f"Purchase successful: Transaction #{transaction.id}")
            
            return Response({
                'success': True,
                'message': f'Purchase completed! You now own "{nft.title}"',
                'transaction_id': transaction.id,
                'transaction_hash': transaction.transaction_hash,
                'nft_id': nft.id,
                'total_amount': str(total_amount),
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Purchase error: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TransactionViewSet(viewsets.ModelViewSet):
    """Transaction CRUD API"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['transaction_status', 'transaction_type']
    search_fields = ['nft__title', 'from_user__username', 'to_user__username']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm pending transaction"""
        transaction = self.get_object()
        
        if transaction.from_user != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        if transaction.transaction_status != 'pending':
            return Response({'error': 'Transaction not pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update transaction and NFT
        transaction.transaction_status = 'completed'
        transaction.confirmed_at = timezone.now()
        transaction.save()
        
        transaction.nft.owner = transaction.to_user
        transaction.nft.status = 'sold'
        transaction.nft.save()
        
        return Response({'message': 'Transaction confirmed'})


class UserProfileViewSet(viewsets.ModelViewSet):
    """User Profile CRUD API"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['user__username', 'bio']
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

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def statistics(self, request):
        """Get global platform statistics"""
        from django.db.models import Sum
        
        total_creators = CreatorProfile.objects.count()
        total_nfts = NFT.objects.count()
        total_sales = Transaction.objects.filter(transaction_type='sale', transaction_status='completed').count()
        total_volume = Transaction.objects.filter(
            transaction_type='sale', 
            transaction_status='completed'
        ).aggregate(total=Sum('price'))['total'] or 0
        
        return Response({
            'total_creators': total_creators,
            'total_created': total_nfts,
            'total_sales': total_sales,
            'total_volume': str(total_volume)
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def dashboard_stats(self, request):
        """Get statistics for the logged-in creator"""
        from django.db.models import Count, Sum
        
        user = request.user
        
        # Ensure user has a creator profile
        if not hasattr(user, 'creator_profile'):
            return Response(
                {'error': 'User is not a creator'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # 1. Total NFTs created
        total_nfts = NFT.objects.filter(creator=user).count()
        
        # 2. Total Sales (Count of sold NFTs)
        total_sold = Transaction.objects.filter(
            from_user=user,
            transaction_type='sale',
            transaction_status='completed'
        ).count()
        
        # 3. Total Buyers (Unique buyers)
        buyers_count = Transaction.objects.filter(
            from_user=user,
            transaction_type='sale',
            transaction_status='completed'
        ).values('to_user').distinct().count()
        
        # 4. Total Earnings (Sum of sales price)
        total_earnings = Transaction.objects.filter(
            from_user=user,
            transaction_type='sale',
            transaction_status='completed'
        ).aggregate(total=Sum('price'))['total'] or 0
        
        return Response({
            'total_created': total_nfts,
            'total_sales_count': total_sold,
            'total_buyers': buyers_count,
            'total_earnings': str(total_earnings)
        })


# ===== Template Views =====
class NFTDashboardView(TemplateView):
    template_name = 'market/nft_dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['nft_form'] = NFTForm()
        return context


class TransactionDashboardView(TemplateView):
    template_name = 'market/transaction_dashboard.html'