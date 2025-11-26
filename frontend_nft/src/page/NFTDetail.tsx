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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">NFT Not Found</h2>
          <button
            onClick={() => navigate("/explore")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  // Image URL sudah lengkap dari backend
  const imageUrl = nft.image || "/placeholder-nft.png";

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-500 hover:text-blue-600 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={nft.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{nft.title}</h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">Creator</p>
            <p className="text-xl font-semibold">{nft.creator.username}</p>
          </div>

          {nft.owner && (
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Owner</p>
              <p className="text-xl font-semibold">{nft.owner.username}</p>
            </div>
          )}

          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600 mb-2">
              {nft.owner ? "Sold Price" : "Current Price"}
            </p>
            <p className="text-3xl font-bold text-blue-600">{nft.price} ETH</p>
          </div>

          <div className="mb-4">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                nft.status === "listed"
                  ? "bg-blue-100 text-blue-800"
                  : nft.status === "sold"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {nft.status.toUpperCase()}
            </span>
          </div>

          {nft.status === "listed" && !nft.owner && (
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => navigate(`/transaction/${nft.id}`)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Buy Now
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-6 rounded-lg transition-colors">
                Make Offer
              </button>
            </div>
          )}

          {nft.status === "sold" && nft.owner && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">
                This NFT has been sold to {nft.owner.username}
              </p>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-700">
              {nft.description ||
                "This is a unique NFT from the collection. Each piece is one-of-a-kind and verified on the blockchain."}
            </p>
          </div>

          <div className="border-t mt-6 pt-6">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Token ID</p>
                <p className="font-semibold break-all">{nft.token_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Contract Address</p>
                <p className="font-semibold break-all text-xs">
                  {nft.contract_address}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Token Standard</p>
                <p className="font-semibold">ERC-721</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold capitalize">{nft.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Created At</p>
                <p className="font-semibold">
                  {new Date(nft.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
