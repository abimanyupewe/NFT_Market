import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Creator = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context not found</div>;
  }

  const { creators, loading, error } = context;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Top Creators</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {creators.map((creator) => (
          <div
            key={creator.pk}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex flex-col items-center">
                <img
                  src={
                    typeof creator.profile_image === "string" &&
                    (creator.profile_image as string).startsWith("http")
                      ? creator.profile_image
                      : `http://127.0.0.1:8000${creator.profile_image}`
                  }
                  alt={creator.user.username}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-500"
                />
                <h3 className="text-xl font-semibold mb-2">
                  {creator.user.username}
                </h3>
                <p className="text-gray-600 text-sm text-center line-clamp-3">
                  {creator.bio || "No bio available"}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {creators.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl">No creators found</p>
        </div>
      )}
    </div>
  );
};

export default Creator;
