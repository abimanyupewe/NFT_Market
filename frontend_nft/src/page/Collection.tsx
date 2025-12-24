import { useContext, useEffect, useState } from "react";
import { AppContext, type NFT } from "../context/AppContext";
import { NFTCard } from "../components/NFTCard";

const Collection = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context not found</div>;
  }

  // Local state for sold NFTs
  const [soldNFTs, setSoldNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Sold NFTs from Backend API
  useEffect(() => {
    const fetchSoldNFTs = async () => {
      try {
        const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
        const res = await fetch(`${backendUrl}/api/nfts/sold/`);
        if (!res.ok) throw new Error("Failed to fetch sold NFTs");
        const data = await res.json();
        setSoldNFTs(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load sold collection");
      } finally {
        setLoading(false);
      }
    };

    fetchSoldNFTs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-bg-primary">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FC1E5C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 min-h-screen bg-bg-primary">
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
            <NFTCard key={nft.id} nft={nft} />
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
