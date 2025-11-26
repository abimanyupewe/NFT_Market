import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const NFTDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [nft, setNFT] = useState<NFT | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNFT = async () => {
      if (context && id) {
        setLoading(true);
        const nftId = parseInt(id);

        console.log("Looking for NFT with ID:", nftId);

        // Coba cari di cache dulu - gunakan field 'id' bukan 'pk'
        const cachedNFT = context.nfts.find((item) => item.id === nftId);

        if (cachedNFT) {
          console.log("Found in cache:", cachedNFT);
          setNFT(cachedNFT);
          setLoading(false);
        } else {
          // Jika tidak ada di cache, fetch dari API
          console.log("Not in cache, fetching from API...");
          const fetchedNFT = await context.getNFTById(nftId);
          if (fetchedNFT) {
            console.log("Fetched from API:", fetchedNFT);
            setNFT(fetchedNFT);
          }
          setLoading(false);
        }
      }
    };

    fetchNFT();
  }, [id, context]);

  if (!context) {
    return <div>Error: Context not found</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FC1E5C]"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">NFT Not Found</h2>
          <button
            onClick={() => navigate("/explore")}
            className="bg-gradient-to-r from-[#FC1E5C] to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = nft.image || "/placeholder-nft.png";

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-10">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FC1E5C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-[#FC1E5C] hover:text-pink-400 flex items-center gap-2 font-semibold"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative group">
            <div className="bg-[#0f172a]/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#1e293b]/50 hover:border-[#FC1E5C] transition-all">
              <div className="aspect-square bg-gradient-to-br from-[#FC1E5C]/80 to-purple-600/80 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status badge on image */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-md ${
                    nft.status === "listed"
                      ? "bg-green-500/90 text-white"
                      : "bg-gray-500/90 text-white"
                  }`}
                >
                  {nft.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-[#0f172a]/30 backdrop-blur-sm rounded-2xl p-8 border border-[#1e293b]/50">
            <h1 className="text-4xl font-bold mb-6 text-white">{nft.title}</h1>

            {/* Creator Section */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <p className="text-gray-400 text-sm mb-3">Created By</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FC1E5C] to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {nft.creator.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">
                    @{nft.creator.username}
                  </p>
                  <p className="text-sm text-gray-400">Creator</p>
                </div>
              </div>
            </div>

            {/* Owner Section */}
            {nft.owner && (
              <div className="mb-6 pb-6 border-b border-white/10">
                <p className="text-gray-400 text-sm mb-3">Owned By</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                    {nft.owner.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">
                      @{nft.owner.username}
                    </p>
                    <p className="text-sm text-gray-400">Current Owner</p>
                  </div>
                </div>
              </div>
            )}

            {/* Price Section */}
            <div className="mb-6 p-6 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-white/10">
              <p className="text-gray-400 text-sm mb-2">
                {nft.owner ? "Sold Price" : "Current Price"}
              </p>
              <p className="text-4xl font-bold text-[#FC1E5C]">
                {nft.price} ETH
              </p>
            </div>

            {/* Action Buttons */}
            {nft.status === "listed" && !nft.owner && (
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => navigate(`/transaction/${nft.id}`)}
                  className="flex-1 bg-gradient-to-r from-[#FC1E5C] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Buy Now
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-6 rounded-xl transition-all">
                  Make Offer
                </button>
              </div>
            )}

            {nft.status === "sold" && nft.owner && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-md">
                <p className="text-green-400 font-semibold">
                  ✓ This NFT has been sold to @{nft.owner.username}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Description
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {nft.description ||
                  "This is a unique NFT from the collection. Each piece is one-of-a-kind and verified on the blockchain."}
              </p>
            </div>

            {/* Details Grid */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Token ID</p>
                  <p className="font-semibold text-white break-all text-sm">
                    {nft.token_id}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Token Standard</p>
                  <p className="font-semibold text-white text-sm">ERC-721</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg col-span-2">
                  <p className="text-gray-400 text-xs mb-1">Contract Address</p>
                  <p className="font-semibold text-white break-all text-xs">
                    {nft.contract_address}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Created</p>
                  <p className="font-semibold text-white text-sm">
                    {new Date(nft.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Chain</p>
                  <p className="font-semibold text-white text-sm">Ethereum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
