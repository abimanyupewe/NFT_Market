import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-6">
            Start Your NFT Journey Today
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of creators and collectors in the world's leading NFT
            marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/explore")}
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              Explore NFTs
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-200 transform hover:scale-105"
            >
              Create Account
            </button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-sm opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-sm opacity-90">NFTs Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <div className="text-sm opacity-90">Trading Volume</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
