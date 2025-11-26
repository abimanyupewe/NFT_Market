import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Auctions = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "live" | "ending">("all");

  if (!context) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white">
        Error: Context not found
      </div>
    );
  }

  const { nfts, loading, error } = context;

  // Filter NFTs for auctions (listed status)
  const auctionNFTs = nfts.filter((nft) => nft.status === "listed");

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
          <h1 className="text-4xl font-bold mb-4 text-white">Live Auctions</h1>
          <p className="text-gray-400 mb-6">
            Bid on {auctionNFTs.length} exclusive NFTs and own unique digital
            assets
          </p>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-[#FC1E5C] to-purple-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              All Auctions
            </button>
            <button
              onClick={() => setFilter("live")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === "live"
                  ? "bg-gradient-to-r from-[#FC1E5C] to-purple-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Live Now
            </button>
            <button
              onClick={() => setFilter("ending")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === "ending"
                  ? "bg-gradient-to-r from-[#FC1E5C] to-purple-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Ending Soon
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {auctionNFTs.map((nft) => (
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

                {/* LIVE badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md bg-red-500/90 text-white animate-pulse">
                    🔥 LIVE
                  </span>
                </div>

                {/* Price badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md bg-green-500/90 text-white">
                    {nft.price} ETH
                  </span>
                </div>

                {/* Avatar & Username */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FC1E5C] to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {nft.creator.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-semibold backdrop-blur-md bg-black/30 px-2 py-1 rounded-lg">
                    @{nft.creator.username}
                  </span>
                </div>
              </div>

              <div className="p-4 relative z-10">
                <h3 className="text-lg font-bold text-white mb-2 truncate">
                  {nft.title}
                </h3>

                {/* Auction timer */}
                <div className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ends in 2h 34m
                </div>

                {/* Action buttons row */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/transaction/${nft.id}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#FC1E5C] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-3 rounded-lg text-sm font-bold transition-all duration-200"
                  >
                    Place Bid
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/nft/${nft.id}`);
                    }}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center transition-all"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {auctionNFTs.length === 0 && !loading && (
          <div className="text-center py-16 bg-[#0f172a]/30 backdrop-blur-sm rounded-xl border border-[#1e293b]/50">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Active Auctions
            </h3>
            <p className="text-gray-500">
              Check back later for exciting auction opportunities
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;
