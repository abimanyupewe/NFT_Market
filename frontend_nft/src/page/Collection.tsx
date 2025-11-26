import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Collection = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Error: Context not found</div>;
  }

  const { nfts, loading, error } = context;

  // Filter NFT yang sudah ada ownernya (sudah sold)
  const soldNFTs = nfts.filter(
    (nft) => nft.owner !== null || nft.status === "sold"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FC1E5C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 min-h-screen bg-[#020617]">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-10">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FC1E5C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Sold Collection
          </h1>
          <p className="text-gray-400">
            Explore {soldNFTs.length} NFTs that have been sold
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {soldNFTs.map((nft) => (
            <div
              key={nft.id}
              onClick={() => navigate(`/nft/${nft.id}`)}
              className="group relative bg-[#0f172a]/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:transform hover:shadow-2xl transition-all duration-300 border border-[#1e293b]/50 hover:border-[#FC1E5C] cursor-pointer"
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-[#FC1E5C]/80 to-purple-600/80 flex items-center justify-center overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                </div>

                {/* SOLD tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md bg-red-500/90 text-white">
                    SOLD
                  </span>
                </div>

                {/* Price badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md bg-gray-500/90 text-white">
                    {nft.price} ETH
                  </span>
                </div>
              </div>

              <div className="p-4 relative z-10">
                <h3 className="text-lg font-bold text-white mb-2 truncate">
                  {nft.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {soldNFTs.length === 0 && !loading && (
          <div className="text-center py-16 bg-[#0f172a]/30 backdrop-blur-sm rounded-xl border border-[#1e293b]/50">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Sold NFTs Found
            </h3>
            <p className="text-gray-500">
              Check back later for sold collections
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
