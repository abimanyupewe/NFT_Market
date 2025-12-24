import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { NFTCard } from "./NFTCard";

const FeatureSection = () => {
  const appCtx = useContext(AppContext);
  const navigate = useNavigate();

  if (!appCtx) return null;

  const { nfts, loading } = appCtx;

  console.log("NFTs di FeatureSection:", nfts);

  return (
    <section className="mb-16 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FC1E5C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Featured NFTs</h2>
          <p className="text-gray-400">
            Discover some of our exclusive digital collectibles
          </p>
        </div>
        <button
          onClick={() => navigate("/explore")}
          className="text-[#FC1E5C] hover:text-pink-400 font-medium flex items-center"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.slice(0, 4).map((nft) => (
            <NFTCard key={nft.id || nft.pk} nft={nft} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0f172a]/30 backdrop-blur-sm rounded-xl border border-[#1e293b]/50">
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
