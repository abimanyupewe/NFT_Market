import { useNavigate } from "react-router-dom";

const TrendingCategories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Digital Art",
      icon: "🎨",
      count: "1.2K",
      gradient: "from-purple-500 to-pink-500",
      image:
        "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400",
    },
    {
      name: "Gaming",
      icon: "🎮",
      count: "850",
      gradient: "from-blue-500 to-cyan-500",
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    },
    {
      name: "Music",
      icon: "🎵",
      count: "620",
      gradient: "from-green-500 to-emerald-500",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
    },
    {
      name: "Photography",
      icon: "📸",
      count: "940",
      gradient: "from-orange-500 to-red-500",
      image:
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400",
    },
    {
      name: "Virtual Worlds",
      icon: "🌐",
      count: "520",
      gradient: "from-indigo-500 to-purple-500",
      image:
        "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400",
    },
    {
      name: "Collectibles",
      icon: "💎",
      count: "780",
      gradient: "from-pink-500 to-rose-500",
      image:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Trending Categories</h2>
          <p className="text-gray-600 text-lg">
            Explore popular NFT categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => navigate("/explore")}
              className="group relative overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-square relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}
                ></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count} NFTs</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingCategories;
