import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Auctions = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "live" | "ending">("all");

  if (!context) {
    return <div>Error: Context not found</div>;
  }

  const { nfts, loading, error } = context;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Live Auctions</h1>
        <p className="text-gray-600 mb-6">
          Bid on exclusive NFTs and own unique digital assets
        </p>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Auctions
          </button>
          <button
            onClick={() => setFilter("live")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === "live"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Live Now
          </button>
          <button
            onClick={() => setFilter("ending")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === "ending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Ending Soon
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.pk}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div
              onClick={() => navigate(`/nft/${nft.pk}`)}
              className="relative pb-[100%] bg-gray-200"
            >
              <img
                src={
                  typeof nft.image === "string" &&
                  (nft.image as string).startsWith("http")
                    ? nft.image
                    : `http://127.0.0.1:8000${nft.image}`
                }
                alt={nft.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                LIVE
              </div>
            </div>

            <div className="p-4">
              <h3
                onClick={() => navigate(`/nft/${nft.pk}`)}
                className="text-lg font-semibold mb-2 truncate cursor-pointer hover:text-blue-600"
              >
                {nft.title}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Owner:</span>
                <span className="text-sm font-medium">
                  {nft.owner?.username || "Unknown Owner"}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500">Current Bid</p>
                <p className="text-xl font-bold text-blue-600">
                  {nft.price} ETH
                </p>
              </div>

              <div className="mb-3 text-sm text-gray-600">
                <p>Ends in: 2h 45m</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/nft/${nft.pk}`);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
              >
                Place Bid
              </button>
            </div>
          </div>
        ))}
      </div>

      {nfts.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-20">
          <p className="text-2xl mb-2">No Auctions Available</p>
          <p className="text-gray-400">Check back later for new auctions</p>
        </div>
      )}
    </div>
  );
};

export default Auctions;
