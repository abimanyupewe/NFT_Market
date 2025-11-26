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
      setLoading(true);
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";

      try {
        // Fetch statistics from API
        const response = await fetch(
          `${backendUrl}api/creator-profiles/statistics/`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Statistics from API:", data);

          // Calculate total volume from NFTs
          const totalVolume =
            context?.nfts.reduce(
              (sum, nft) => sum + parseFloat(nft.price || "0"),
              0
            ) || 0;

          setStatistics({
            total_assets: data.total_created || context?.nfts.length || 0,
            total_creators:
              data.total_creators || context?.creators.length || 0,
            total_volume: totalVolume,
          });
        } else {
          // Fallback to context data if API fails
          console.warn("Failed to fetch statistics, using context data");

          const totalVolume =
            context?.nfts.reduce(
              (sum, nft) => sum + parseFloat(nft.price || "0"),
              0
            ) || 0;

          setStatistics({
            total_assets: context?.nfts.length || 0,
            total_creators: context?.creators.length || 0,
            total_volume: totalVolume,
          });
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);

        // Fallback to context data
        const totalVolume =
          context?.nfts.reduce(
            (sum, nft) => sum + parseFloat(nft.price || "0"),
            0
          ) || 0;

        setStatistics({
          total_assets: context?.nfts.length || 0,
          total_creators: context?.creators.length || 0,
          total_volume: totalVolume,
        });
      } finally {
        setLoading(false);
      }
    };

    if (context && !context.loading) {
      fetchStatistics();
    }
  }, [context?.nfts, context?.creators, context?.loading]);

  const stats = [
    {
      label: "Total NFTs",
      value: statistics.total_assets.toLocaleString(),
      description: "Unique digital assets",
    },
    {
      label: "Total Creators",
      value: statistics.total_creators.toLocaleString(),
      description: "Active creators",
    },
    {
      label: "Total Volume",
      value: `${statistics.total_volume.toFixed(2)} ETH`,
      description: "Trading volume",
    },
  ];

  if (loading || context?.loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-white">
      {stats.map((stat, index) => (
        <div
          key={index}
        >
          <h3 className={`text-4xl text-primary font-bold mb-2`}>
            {stat.value}
          </h3>
          <p className="font-semibold text-lg mb-1">
            {stat.label}
          </p>
          <p className="text-sm">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
