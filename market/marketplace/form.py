from django import forms
from .models import NFT, Transaction, UserProfile, CreatorProfile

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['name', 'bio', 'wallet_address', 'profile_image']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter your display name'
            }),
            'bio': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Tell us about yourself...',
                'rows': 4
            }),
            'wallet_address': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter your wallet address'
            }),
            'profile_image': forms.FileInput(attrs={
                'class': 'form-input',
                'accept': 'image/*'
            })
        }
        labels = {
            'name': 'Display Name',
            'bio': 'Bio',
            'wallet_address': 'Wallet Address',
            'profile_image': 'Profile Image'
        }

class CreatorProfileForm(forms.ModelForm):
    class Meta:
        model = CreatorProfile
        fields = ['name', 'wallet_address', 'bio', 'profile_image']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter creator name'
            }),
            'wallet_address': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter your wallet address for receiving payments'
            }),
            'bio': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Tell us about your art and creative journey...',
                'rows': 4
            }),
            'profile_image': forms.FileInput(attrs={
                'class': 'form-input',
                'accept': 'image/*'
            })
        }
        labels = {
            'name': 'Creator Name',
            'wallet_address': 'Payment Wallet Address',
            'bio': 'Artist Bio',
            'profile_image': 'Profile Image'
        }

class NFTForm(forms.ModelForm):
    class Meta:
        model = NFT
        fields = ['title', 'description', 'image', 'price', 'status', 'token_id', 'contract_address']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter NFT title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Describe your NFT...',
                'rows': 4
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-input',
                'accept': 'image/*'
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter price in ETH',
                'step': '0.01',
                'min': '0.01'
            }),
            'status': forms.Select(attrs={
                'class': 'form-input',
            }),
            'token_id': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Token ID (auto-generated if empty)'
            }),
            'contract_address': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Contract Address (optional)'
            })
        }
        labels = {
            'title': 'NFT Title',
            'description': 'Description',
            'image': 'NFT Image',
            'price': 'Price (ETH)',
            'status': 'Status',
            'token_id': 'Token ID',
            'contract_address': 'Contract Address'
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make token_id and contract_address optional
        self.fields['token_id'].required = False
        self.fields['contract_address'].required = False
        # Set default status to 'listed'
        if not self.instance.pk:
            self.initial['status'] = 'listed'

class PurchaseForm(forms.Form):
    wallet_address = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter your wallet address'
        }),
        label='Your Wallet Address'
    )
    
    payment_method = forms.ChoiceField(
        choices=[
            ('', 'Select payment method'),
            ('eth', 'Ethereum (ETH)'),
            ('btc', 'Bitcoin (BTC)'),
            ('usdt', 'Tether (USDT)')
        ],
        widget=forms.Select(attrs={
            'class': 'form-input'
        }),
        label='Payment Method'
    )

class OfferForm(forms.Form):
    offer_price = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        widget=forms.NumberInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter your offer price',
            'step': '0.01',
            'min': '0.01'
        }),
        label='Your Offer Price (USD)'
    )
    
    wallet_address = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Enter your wallet address'
        }),
        label='Your Wallet Address'
    )
    
    payment_method = forms.ChoiceField(
        choices=[
            ('', 'Select payment method'),
            ('eth', 'Ethereum (ETH)'),
            ('btc', 'Bitcoin (BTC)'),
            ('usdt', 'Tether (USDT)')
        ],
        widget=forms.Select(attrs={
            'class': 'form-input'
        }),
        label='Payment Method'
    )
    
    message = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-input',
            'placeholder': 'Add a personal message to the owner...',
            'rows': 3
        }),
        label='Message to Owner (Optional)'
    )

class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['transaction_type', 'price', 'payment_method', 'wallet_address']
        widgets = {
            'transaction_type': forms.Select(attrs={
                'class': 'form-input'
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-input',
                'step': '0.01',
                'min': '0.01'
            }),
            'payment_method': forms.Select(attrs={
                'class': 'form-input'
            }),
            'wallet_address': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter wallet address'
            })
        }