# NFT_Market

A Django-based NFT (Non-Fungible Token) Marketplace application.

## Quick Start

To quickly get started with the NFT Marketplace:

```bash
# Clone the repository
git clone https://github.com/abimanyupewe/NFT_Market.git
cd NFT_Market

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create sample data (optional but recommended)
python manage.py create_sample_data

# Create superuser for admin access
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

Visit http://127.0.0.1:8000/ to view the marketplace!

## Features

- User authentication and profiles with wallet addresses
- NFT listing and management
- Transaction history tracking
- Admin interface for managing NFTs and transactions
- Responsive web interface
- Sample data generator for testing

## Models

### UserProfile
- Extended user profile with bio, wallet address, and profile image
- Linked to Django's built-in User model

### NFT
- Title, description, and image
- Owner and creator tracking
- Price and status (draft, listed, sold)
- Token ID and contract address for blockchain integration
- Timestamped creation and updates

### Transaction
- Transaction history for NFTs
- Support for mint, sale, and transfer operations
- From/to user tracking
- Price and transaction hash

## Installation

1. Clone the repository:
```bash
git clone https://github.com/abimanyupewe/NFT_Market.git
cd NFT_Market
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser for admin access:
```bash
python manage.py createsuperuser
```

7. (Optional) Create sample data for testing:
```bash
python manage.py create_sample_data
```

8. Run the development server:
```bash
python manage.py runserver
```

9. Access the application:
- Homepage: http://127.0.0.1:8000/
- Admin interface: http://127.0.0.1:8000/admin/
- NFT List: http://127.0.0.1:8000/nfts/

## Project Structure

```
NFT_Market/
├── manage.py
├── requirements.txt
├── nft_market/          # Main project directory
│   ├── settings.py      # Project settings
│   ├── urls.py          # Main URL configuration
│   ├── wsgi.py
│   └── asgi.py
└── marketplace/         # Main app
    ├── models.py        # Database models
    ├── views.py         # View functions
    ├── urls.py          # App URL patterns
    ├── admin.py         # Admin configuration
    ├── templates/       # HTML templates
    └── migrations/      # Database migrations
```

## Usage

### Admin Panel
1. Login to the admin panel with your superuser credentials
2. Add users, NFTs, and transactions
3. Manage NFT status and pricing

### Adding NFTs
Through the admin panel:
1. Navigate to NFTs section
2. Click "Add NFT"
3. Fill in the details (title, description, price, owner, creator)
4. Upload an image (optional)
5. Set status to "listed" to display on the marketplace

### Running Tests
Run the test suite to ensure everything is working correctly:
```bash
python manage.py test
```

All 6 tests should pass, covering:
- Model creation and validation
- View functionality
- Template rendering

## Technologies Used

- Django 5.2.8
- Python 3.12
- SQLite (default database)
- Pillow (for image handling)

## Future Enhancements

- Blockchain integration for actual NFT minting
- Cryptocurrency payment integration
- User authentication (registration, login)
- Search and filtering functionality
- Auction system
- Social features (likes, comments, follows)

## License

This project is open source and available under the MIT License.