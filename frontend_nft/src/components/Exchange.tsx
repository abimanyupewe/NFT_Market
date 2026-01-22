"use client";

import { assets } from "../assets/assets";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const testimonials = [
  { img: assets.Logo1 },
  { img: assets.Logo2 },
  { img: assets.Logo3 },
  { img: assets.Logo4 },
  { img: assets.Logo5 },
  { img: assets.Logo6 },
];

function Exchange() {
  return (
    <div className="h-96 flex flex-col antialiased bg-[#020617] items-center justify-center relative overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        Trusted By Leading Exchanges
      </h2>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

export default Exchange;
