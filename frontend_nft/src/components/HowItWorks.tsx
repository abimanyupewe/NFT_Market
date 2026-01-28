import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(".section-header",
        { y: 50, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: ".section-header",
            start: "top 80%",
          },
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out"
        }
      );

      // Steps Animation
      gsap.fromTo(".step-card",
        { y: 100, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: ".steps-grid",
            start: "top 85%",
          },
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }
      );

      // Arrow Animation
      gsap.fromTo(".step-arrow",
        { width: 0, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: ".steps-grid",
            start: "top 85%",
          },
          width: 32, // w-8 = 32px roughly
          autoAlpha: 1,
          duration: 1,
          delay: 0.5,
          stagger: 0.2,
          ease: "power2.inOut"
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Connect your crypto wallet to our platform securely",
    },
    {
      number: "02",
      title: "Browse NFTs",
      description: "Explore our vast collection of unique digital assets",
    },
    {
      number: "03",
      title: "Make Purchase",
      description: "Buy your favorite NFTs with secure payment methods",
    },
    {
      number: "04",
      title: "Own & Trade",
      description: "Own your NFTs and trade them on the marketplace",
    },
  ];

  return (
    <div ref={containerRef} className="py-16 bg-bg-primary overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 section-header">
          <h2 className="text-4xl font-bold mb-4 text-white">How It Works</h2>
          <p className="text-gray-400 text-lg">
            Get started in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="relative step-card">
              <div className="bg-[#0f172a]/30 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-[#1e293b]/50 hover:bg-primary/10 group h-full">
                {/* Number Badge */}
                <span className="text-2xl font-bold text-primary block mb-4">
                  {step.number}
                </span>

                <h3 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 step-arrow">
                  <div className="w-8 h-0.5 bg-linear-to-r from-[#FC1E5C] to-transparent"></div>
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
