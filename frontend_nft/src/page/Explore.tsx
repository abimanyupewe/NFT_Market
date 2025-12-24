import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { NFTCard } from "../components/NFTCard";
import { Flame, Rocket } from "lucide-react";

const Explore = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context not found</div>;
  }

  const { nfts, loading, error } = context;

  // Filter NFTs
  const upcomingNFTs = nfts
    .filter((nft) => nft.status === "pre_listing")
    .sort((a, b) => {
      const dateA = a.listing_date ? new Date(a.listing_date).getTime() : 0;
      const dateB = b.listing_date ? new Date(b.listing_date).getTime() : 0;
      return dateA - dateB;
    });

  const availableNFTs = nfts.filter(
    (nft) => nft.status === "listed"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black-cus">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FC1E5C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 min-h-screen bg-black-cus">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-10">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FC1E5C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">

        {/* Upcoming Drops Section */}
        {upcomingNFTs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="w-8 h-8 text-[#FC1E5C]" />
              <div>
                <h2 className="text-3xl font-bold text-white">Upcoming Drops</h2>
                <p className="text-gray-400">Be ready! These exclusive items are dropping soon.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {upcomingNFTs.map((nft) => (
                <NFTCard key={nft.id || nft.pk} nft={nft} />
              ))}
            </div>
          </div>
        )}

        {/* Main Market Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">Explore NFTs</h1>
              <p className="text-gray-400">
                Discover {availableNFTs.length} unique NFTs available for purchase
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableNFTs.map((nft) => (
              <NFTCard key={nft.id || nft.pk} nft={nft} />
            ))}
          </div>

          {availableNFTs.length === 0 && !loading && (
            <div className="text-center py-16 bg-[#0f172a]/30 backdrop-blur-sm rounded-xl border border-[#1e293b]/50">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No Listings Available
              </h3>
              <p className="text-gray-500">
                All items are currently sold or not listed yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
