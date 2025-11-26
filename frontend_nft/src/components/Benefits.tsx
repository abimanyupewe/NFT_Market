const Benefits = () => {
  const benefits = [
    {
      icon: "🔒",
      title: "Secure Transactions",
      description: "All transactions are secured by blockchain technology",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "⚡",
      title: "Fast Processing",
      description:
        "Lightning-fast transaction processing with minimal gas fees",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "🌍",
      title: "Global Marketplace",
      description: "Buy and sell NFTs from creators around the world",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: "💎",
      title: "Verified NFTs",
      description: "All NFTs are verified and authenticated on blockchain",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Track your portfolio with detailed analytics and insights",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: "🤝",
      title: "Community Driven",
      description: "Join a thriving community of collectors and creators",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-gray-600 text-lg">
            Experience the best NFT marketplace features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}
              >
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
