import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

interface StatisticsData {
  total_assets: number;
  total_creators: number;
  total_volume: number;
}

const Statistics = () => {
  const context = useContext(AppContext);
  const [statistics, setStatistics] = useState<StatisticsData>({
    total_assets: 0,
    total_creators: 0,
    total_volume: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

      try {
        const response = await fetch(`${backendUrl}/infografis/`);
        if (response.ok) {
          const data = await response.json();

          // Calculate total volume from context
          const totalVolume =
            context?.nfts.reduce(
              (sum, nft) => sum + parseFloat(nft.price),
              0
            ) || 0;

          setStatistics({
            total_assets: data.total_assets,
            total_creators: data.total_creators,
            total_volume: totalVolume,
          });
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [context?.nfts]);

  const stats = [
    {
      icon: "🎨",
      label: "Total NFTs",
      value: statistics.total_assets.toLocaleString(),
      color: "from-blue-500 to-cyan-500",
      description: "Unique digital assets",
    },
    {
      icon: "👥",
      label: "Total Creators",
      value: statistics.total_creators.toLocaleString(),
      color: "from-purple-500 to-pink-500",
      description: "Active creators",
    },
    {
      icon: "💰",
      label: "Total Volume",
      value: `${statistics.total_volume.toFixed(2)} ETH`,
      color: "from-green-500 to-emerald-500",
      description: "Trading volume",
    },
  ];

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Marketplace Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`text-5xl mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-gray-900 font-semibold text-lg mb-1">
                {stat.label}
              </p>
              <p className="text-gray-500 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
