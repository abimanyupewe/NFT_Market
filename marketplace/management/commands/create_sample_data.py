from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from marketplace.models import UserProfile, NFT, Transaction
from decimal import Decimal


class Command(BaseCommand):
    help = 'Creates sample data for the NFT marketplace'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')

        # Create users
        users_data = [
            {'username': 'alice', 'email': 'alice@example.com', 'password': 'password123'},
            {'username': 'bob', 'email': 'bob@example.com', 'password': 'password123'},
            {'username': 'charlie', 'email': 'charlie@example.com', 'password': 'password123'},
        ]

        users = []
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(f'Created user: {user.username}')
            users.append(user)

        # Create user profiles
        for user in users:
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'bio': f'NFT enthusiast and collector. Welcome to my profile!',
                    'wallet_address': f'0x{user.username}1234567890abcdef',
                }
            )
            if created:
                self.stdout.write(f'Created profile for: {user.username}')

        # Create sample NFTs
        nfts_data = [
            {
                'title': 'Digital Sunset',
                'description': 'A beautiful digital representation of a sunset over the ocean.',
                'price': Decimal('150.00'),
                'status': 'listed',
            },
            {
                'title': 'Crypto Punk #001',
                'description': 'Unique pixelated character from the crypto world.',
                'price': Decimal('500.00'),
                'status': 'listed',
            },
            {
                'title': 'Abstract Dreams',
                'description': 'An abstract art piece exploring colors and shapes.',
                'price': Decimal('250.00'),
                'status': 'listed',
            },
            {
                'title': 'Neon City',
                'description': 'Futuristic cityscape with neon lights.',
                'price': Decimal('300.00'),
                'status': 'listed',
            },
            {
                'title': 'Space Explorer',
                'description': 'An astronaut exploring the cosmos.',
                'price': Decimal('400.00'),
                'status': 'listed',
            },
            {
                'title': 'Digital Garden',
                'description': 'A serene digital garden full of life.',
                'price': Decimal('200.00'),
                'status': 'sold',
            },
        ]

        for i, nft_data in enumerate(nfts_data):
            creator = users[i % len(users)]
            owner = users[(i + 1) % len(users)] if nft_data['status'] == 'sold' else creator
            
            nft, created = NFT.objects.get_or_create(
                title=nft_data['title'],
                defaults={
                    'description': nft_data['description'],
                    'price': nft_data['price'],
                    'status': nft_data['status'],
                    'owner': owner,
                    'creator': creator,
                    'token_id': f'NFT{i+1:04d}',
                    'contract_address': '0xNFTMarketplaceContract123',
                }
            )
            if created:
                self.stdout.write(f'Created NFT: {nft.title}')

                # Create mint transaction
                Transaction.objects.create(
                    nft=nft,
                    from_user=None,
                    to_user=creator,
                    transaction_type='mint',
                    price=None,
                    transaction_hash=f'0xmint{i+1:04d}',
                )

                # Create sale transaction if sold
                if nft_data['status'] == 'sold':
                    Transaction.objects.create(
                        nft=nft,
                        from_user=creator,
                        to_user=owner,
                        transaction_type='sale',
                        price=nft_data['price'],
                        transaction_hash=f'0xsale{i+1:04d}',
                    )

        self.stdout.write(self.style.SUCCESS('Successfully created sample data!'))
        self.stdout.write(f'Created {len(users)} users')
        self.stdout.write(f'Created {len(nfts_data)} NFTs')
        self.stdout.write('\nYou can now run the server with: python manage.py runserver')
