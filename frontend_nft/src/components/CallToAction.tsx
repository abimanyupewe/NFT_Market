import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const CallToAction = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content Entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });

      tl.fromTo(".cta-title",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(".cta-desc",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(".cta-btn",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.2, ease: "back.out(1.5)" },
          "-=0.6"
        );

      // Background Blobs Loop
      gsap.to(".cta-blob-1", {
        scale: 1.2,
        rotation: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(".cta-blob-2", {
        scale: 1.3,
        rotation: -10,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="py-20 bg-gradient-to-r from-bg-primary via-[#0f172a] to-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FC1E5C] rounded-full blur-3xl cta-blob-1"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl cta-blob-2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-6 cta-title">
            Start Your NFT Journey Today
          </h2>
          <p className="text-xl mb-8 text-gray-400 max-w-2xl mx-auto cta-desc">
            Join thousands of creators and collectors in the world's leading NFT
            marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/explore")}
              className="bg-[#FC1E5C] hover:bg-[#e01850] text-white font-bold py-4 px-8 transition-all duration-200 transform hover:scale-105 shadow-xl cta-btn rounded-full"
            >
              Explore NFTs
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-gray-400 text-white hover:text-gray-200 hover:border-white px-8 py-3 font-semibold transition-all duration-700 cta-btn rounded-full"
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
