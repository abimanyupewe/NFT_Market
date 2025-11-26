const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: "👛",
      title: "Connect Wallet",
      description: "Connect your crypto wallet to our platform securely",
      color: "bg-blue-100 text-blue-600",
    },
    {
      number: "02",
      icon: "🔍",
      title: "Browse NFTs",
      description: "Explore our vast collection of unique digital assets",
      color: "bg-purple-100 text-purple-600",
    },
    {
      number: "03",
      icon: "💳",
      title: "Make Purchase",
      description: "Buy your favorite NFTs with secure payment methods",
      color: "bg-green-100 text-green-600",
    },
    {
      number: "04",
      icon: "🎉",
      title: "Own & Trade",
      description: "Own your NFTs and trade them on the marketplace",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">
            Get started in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
                <div
                  className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-3xl mb-4`}
                >
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-gray-400 mb-2">
                  STEP {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg
                    className="w-8 h-8 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
