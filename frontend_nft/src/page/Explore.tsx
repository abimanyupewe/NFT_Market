import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Error: Context not found</div>;
  }

  const { nfts, loading, error } = context;

  // Filter NFT yang belum ada ownernya dan status listed
  const availableNFTs = nfts.filter(
    (nft) => nft.owner === null && nft.status === "listed"
  );

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
        <h1 className="text-4xl font-bold mb-2">Explore NFTs</h1>
        <p className="text-gray-600">
          Discover {availableNFTs.length} unique NFTs available for purchase
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {availableNFTs.map((nft) => (
          <div
            key={nft.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div
              onClick={() => navigate(`/nft/${nft.id}`)}
              className="relative pb-[100%] bg-gray-200"
            >
              <img
                src={nft.image}
                alt={nft.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                AVAILABLE
              </div>
            </div>

            <div className="p-4">
              <h3
                onClick={() => navigate(`/nft/${nft.id}`)}
                className="text-lg font-semibold mb-2 truncate cursor-pointer hover:text-blue-600"
              >
                {nft.title}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Creator:</span>
                <span className="text-sm font-medium text-green-600">
                  {nft.creator.username}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-lg font-bold text-blue-600">
                    {nft.price} ETH
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/transaction/${nft.id}`);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {availableNFTs.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-20">
          <p className="text-2xl mb-2">No NFTs Available</p>
          <p className="text-gray-400">
            All NFTs have been sold. Check back later for new listings
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
