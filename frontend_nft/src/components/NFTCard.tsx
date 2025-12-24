import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface NFTCardProps {
    nft: any;
}

export const NFTCard = ({ nft }: NFTCardProps) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        if (nft.status === 'pre_listing' && nft.listing_date) {
            const calculateTimeLeft = () => {
                const difference = +new Date(nft.listing_date) - +new Date();
                let timeLeft = null;

                if (difference > 0) {
                    timeLeft = {
                        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                        minutes: Math.floor((difference / 1000 / 60) % 60),
                        seconds: Math.floor((difference / 1000) % 60),
                    };
                }
                return timeLeft;
            };

            setTimeLeft(calculateTimeLeft());
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [nft]);

    const isUpcoming = nft.status === 'pre_listing';

    return (
        <div
            onClick={() => navigate(`/nft/${nft.id}`)}
            className="group relative bg-[#0f172a]/30 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:shadow-2xl transition-all duration-300 border border-[#1e293b]/50 hover:border-[#FC1E5C]/30 cursor-pointer h-full flex flex-col"
        >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <div className="relative h-72 w-full">
                <div className="w-full h-full bg-linear-to-br from-[#FC1E5C]/80 to-purple-600/80 flex items-center justify-center overflow-hidden">
                    {nft.image ? (
                        <img
                            src={nft.image}
                            alt={nft.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                        />
                    ) : (
                        <span className="text-6xl">🎨</span>
                    )}
                </div>
                <div className="absolute top-2 right-2">
                    <span
                        className={`px-3 py-1 rounded-sm text-xs font-semibold backdrop-blur-md ${nft.status === "listed"
                            ? "bg-green-500/80 text-white"
                            : nft.status === "pre_listing"
                                ? "bg-yellow-500/80 text-white"
                                : "bg-gray-500/80 text-white"
                            }`}
                    >
                        {nft.status === "listed"
                            ? "Listed"
                            : nft.status === "pre_listing"
                                ? "Upcoming"
                                : nft.status === "sold"
                                    ? "Sold"
                                    : nft.status.charAt(0).toUpperCase() + nft.status.slice(1).replace('_', ' ')}
                    </span>
                </div>

                {isUpcoming && timeLeft && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-2 border-t border-white/10">
                        <div className="flex items-center justify-center gap-4 text-white text-xs font-mono">
                            <div className="text-center">
                                <span className="block text-lg font-bold text-[#FC1E5C]">{timeLeft.days}</span>
                                <span className="text-[10px] text-gray-400">DAYS</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-lg font-bold text-white">{timeLeft.hours}</span>
                                <span className="text-[10px] text-gray-400">HRS</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-lg font-bold text-white">{timeLeft.minutes}</span>
                                <span className="text-[10px] text-gray-400">MIN</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-lg font-bold text-[#FC1E5C]">{timeLeft.seconds}</span>
                                <span className="text-[10px] text-gray-400">SEC</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-bold text-white truncate max-w-[70%]">
                        {nft.title}
                    </h3>
                    <div className="text-xs text-gray-400 flex items-center">
                        By {nft.creator?.username || 'Unknown'}
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                    <div className="text-sm font-semibold text-[#FC1E5C]">
                        {nft.price} ETH
                    </div>
                    <button
                        disabled={isUpcoming}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/nft/${nft.id}`);
                        }}
                        className={`py-2 px-4 text-xs font-bold rounded-md transition-all duration-200 transform ${isUpcoming
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-primary text-white hover:scale-105 shadow-lg shadow-primary/20"
                            }`}
                    >
                        {isUpcoming ? "Coming Soon" : "Buy Now"}
                    </button>
                </div>
            </div>
        </div>
    );
};
