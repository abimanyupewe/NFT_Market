import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Creator = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div className="text-white">Error: Context not found</div>;
  }

  const { creators = [], loading, error } = context; // Add default empty array

  console.log("Creators data:", creators); // Debug log

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black-cus py-16 text-white">
      <div className="">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-start md:items-center md:flex-row justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Top Creators
            </h2>
            <p className="text-gray-400">
              Checkout Top Rated Creators on the NFT Marketplace
            </p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Array.isArray(creators) && creators.length > 0 ? (
            [...creators]
              .sort((a, b) => parseFloat(b.total_sales || "0") - parseFloat(a.total_sales || "0"))
              .map((creator) => (
                <div
                  key={creator.pk}
                  className="group relative flex items-center justify-between rounded-2xl p-4 border border-gray-800 bg-gray-900/40 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 cursor-pointer min-w-[300px]"
                >
                  <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={
                          creator.profile_image?.startsWith("http")
                            ? creator.profile_image
                            : `http://127.0.0.1:8000${creator.profile_image ||
                            "/media/default-avatar.png"
                            }`
                        }
                        alt={creator.user.username}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-700 group-hover:border-primary transition-colors"
                        onError={(e) => {
                          // Fallback jika gambar gagal load
                          e.currentTarget.src = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' dominant-baseline='middle' text-anchor='middle'%3E${creator.user.username.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                      {/* Verified Badge (Hiasan) */}
                      <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1 border-2 border-black-cus">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* 3. Text Info */}
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors truncate">
                        {creator.user.username}
                      </h3>
                      <p className="text-sm text-gray-400 truncate max-w-[200px] md:max-w-md">
                        {creator.bio || "Digital Artist & Collector"}
                      </p>
                    </div>
                  </div>

                  {/* Bagian Kanan: Indikator Arrow (Pengganti Button) */}
                  <div className="pl-4">
                    <div className="p-2 rounded-full bg-gray-800 group-hover:bg-primary group-hover:text-white text-gray-400 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-gray-500 py-20 border border-dashed border-gray-800 rounded-2xl mt-8 w-full">
              <p className="text-xl">No creators found</p>
              <p className="text-sm mt-2">Check console for data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Creator;
