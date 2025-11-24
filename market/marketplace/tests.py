from django.test import TestCase
from django.contrib.auth.models import User
from .models import UserProfile, NFT, Transaction


class UserProfileModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_profile_creation(self):
        profile = UserProfile.objects.create(
            user=self.user,
            bio='Test bio',
            wallet_address='0x123456789'
        )
        self.assertEqual(str(profile), "testuser's profile")
        self.assertEqual(profile.wallet_address, '0x123456789')


class NFTModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='nftowner',
            email='owner@example.com',
            password='testpass123'
        )

    def test_nft_creation(self):
        nft = NFT.objects.create(
            title='Test NFT',
            description='A test NFT',
            owner=self.user,
            creator=self.user,
            price=100.00,
            status='listed'
        )
        self.assertEqual(str(nft), 'Test NFT')
        self.assertEqual(nft.price, 100.00)
        self.assertEqual(nft.status, 'listed')


class TransactionModelTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='seller',
            email='seller@example.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='buyer',
            email='buyer@example.com',
            password='testpass123'
        )
        self.nft = NFT.objects.create(
            title='Test NFT for Transaction',
            description='A test NFT',
            owner=self.user1,
            creator=self.user1,
            price=50.00,
            status='listed'
        )

    def test_transaction_creation(self):
        transaction = Transaction.objects.create(
            nft=self.nft,
            from_user=self.user1,
            to_user=self.user2,
            transaction_type='sale',
            price=50.00
        )
        self.assertEqual(str(transaction), 'sale - Test NFT for Transaction')
        self.assertEqual(transaction.price, 50.00)
        self.assertEqual(transaction.transaction_type, 'sale')


class ViewsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.nft = NFT.objects.create(
            title='Test NFT',
            description='Test Description',
            owner=self.user,
            creator=self.user,
            price=100.00,
            status='listed'
        )

    def test_home_view(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'marketplace/home.html')

    def test_nft_list_view(self):
        response = self.client.get('/nfts/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'marketplace/nft_list.html')

    def test_nft_detail_view(self):
        response = self.client.get(f'/nfts/{self.nft.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'marketplace/nft_detail.html')
        self.assertContains(response, 'Test NFT')
