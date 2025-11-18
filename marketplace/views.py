from django.shortcuts import render
from django.views.generic import ListView, DetailView
from .models import NFT, Transaction


def home(request):
    """Homepage view"""
    featured_nfts = NFT.objects.filter(status='listed')[:6]
    recent_transactions = Transaction.objects.all()[:5]
    context = {
        'featured_nfts': featured_nfts,
        'recent_transactions': recent_transactions,
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
    template_name = 'marketplace/nft_detail.html'
    context_object_name = 'nft'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['transactions'] = self.object.transactions.all()[:10]
        return context
