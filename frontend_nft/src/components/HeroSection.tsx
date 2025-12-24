import {assets} from "../assets/assets";

export const HeroSection = () => {
  return (
    <section className="mt-10 w-full">
      <div
        className="h-lvh w-full bg-black-cus"
        style={{ position: "relative", background: "#020617" }}
      >
    <div
      className="absolute inset-0 z-0"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        background: "#020617",
        backgroundImage: `linear-gradient(
          to right,
          rgba(71, 85, 105, 0.15) 1px,
          transparent 1px
        ),
        linear-gradient(to bottom, rgba(71, 85, 105, 0.15) 1px, transparent 1px),
        radial-gradient(
          circle at 50% 60%,
          rgba(230, 46, 89, 0.15) 0%,
          rgba(168, 85, 247, 0.05) 40%,
          transparent 70%
        )`,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%"
      }}
    >
          <div className="flex">
            <div className="relative px-8 py-16 w-1/2">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Unlock the True Value of{" "}
                <span className="bg-linear-to-r from-indigo-700 via-primary to-orange-400 bg-clip-text text-transparent font-pixel">
                  DIGITAL ASSETS
                </span>
                {" "}with{" "}
                <span className="bg-linear-to-r from-indigo-700 via-primary to-orange-400 bg-clip-text text-transparent font-pixel">
                  NFT ARTS
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Experience a secure and transparent ecosystem designed for
                serious traders. Effortlessly Buy, Sell, Collect, and Auction
                premium NFTs backed by blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href=""
                  className="bg-primary text-white px-8 py-3 font-semibold transition-all duration-700 transform hover:scale-105 shadow-lg shadow-primary/50"
                >
                  Explore NFTs
                </a>
                <a
                  href="#"
                  className="border border-gray-400 text-gray-300 hover:text-white hover:border-white px-8 py-3 font-semibold transition-all duration-700"
                >
                  Sell Your NFT's
                </a>
              </div>
            </div>
            <div className="w-1/2 justify-center flex">
              <img src={assets.ImgHero} alt="ImgHero" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
