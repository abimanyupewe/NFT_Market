import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#020617] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FC1E5C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-6">
            Start Your NFT Journey Today
          </h2>
          <p className="text-xl mb-8 text-gray-400 max-w-2xl mx-auto">
            Join thousands of creators and collectors in the world's leading NFT
            marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/explore")}
              className="bg-[#FC1E5C] hover:bg-[#e01850] text-white font-bold py-4 px-8 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              Explore NFTs
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-gray-400 text-gray-300 hover:text-white hover:border-white px-8 py-3 font-semibold transition-all duration-700"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
