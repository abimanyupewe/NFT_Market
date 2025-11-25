import React from "react";

const FeatureSection = () => {
  const featured_nfts = [
    {
      pk: 1,
      title: "Digital Art #1",
      image: {
        url: "https://example.com/nft1.png",
      },
      price: "250.00",
      owner: {
        username: "artlover123",
      },
    },
    // Tambahkan NFT lain di sini jika perlu
  ];

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Featured NFTs</h2>
        <a
          href="/marketplace/nft_list"
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
        </a>
      </div>

      {featured_nfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured_nfts.map((nft) => (
            <div
              key={nft.pk}
              className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-700"
            >
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  {nft.image ? (
                    <img
                      src={nft.image.url}
                      alt={nft.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🎨</span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Listed
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {nft.title}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-blue-400">
                    ${nft.price}
                  </div>
                  <div className="text-sm text-gray-400">
                    Owner: {nft.owner.username}
                  </div>
                </div>
                <a
                  href={`/marketplace/nft_detail/${nft.pk}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 block text-center"
                >
                  View Details
                </a>
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
