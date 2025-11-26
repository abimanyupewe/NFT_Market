import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const FeatureSection = () => {
  const appCtx = useContext(AppContext);
  const navigate = useNavigate();

  if (!appCtx) return null;

  const { nfts, loading } = appCtx;

  console.log("NFTs di FeatureSection:", nfts);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Featured NFTs</h2>
        <button
          onClick={() => navigate("/explore")}
          className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
        >
          View All
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="text-center text-white py-10">Loading...</div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.slice(0, 8).map((nft) => (
            <div
              key={nft.id || nft.pk}
              onClick={() => navigate(`/nft/${nft.id}`)}
              className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-700 cursor-pointer"
            >
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  {nft.image ? (
                    <img
                      src={nft.image}
                      alt={nft.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(
                          "Image failed to load:",
                          e.currentTarget.src
                        );
                      }}
                    />
                  ) : (
                    <span className="text-6xl">🎨</span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      nft.status === "listed"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {nft.status === "listed" ? "Listed" : "Sold"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {nft.title}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {nft.price} ETH
                  </div>
                  <div className="text-sm text-gray-400">
                    {nft.owner
                      ? `Owner: ${nft.owner.username}`
                      : `By: ${nft.creator.username}`}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/nft/${nft.id}`);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No NFTs Available
          </h3>
          <p className="text-gray-500">
            Check back soon for amazing digital collectibles!
          </p>
        </div>
      )}
    </section>
  );
};

export default FeatureSection;
