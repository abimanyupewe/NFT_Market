import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ProgressLoaderProps {
    isLoading: boolean;
}

export function ProgressLoader({ isLoading }: ProgressLoaderProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const progressRef = useRef({ value: 0 }); // Object to tween
    const timeline = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        // If loading starts, mount the component
        if (isLoading) {
            setIsVisible(true);
        }
    }, [isLoading]);

    useEffect(() => {
        if (!isVisible) return;

        const ctx = gsap.context(() => {
            // Initial animation: fade in
            gsap.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5 }
            );

            // Create timeline for progress simulation
            const tl = gsap.timeline();
            timeline.current = tl;

            if (isLoading) {
                // SIMULATE DATA LOADING (0% -> 90%)
                // Slow down as it gets closer to 90

                // 1. Fast start
                tl.to(progressRef.current, {
                    value: 30,
                    duration: 0.5,
                    ease: "power2.out",
                    onUpdate: updateUI
                })
                    // 2. Medium middle
                    .to(progressRef.current, {
                        value: 60,
                        duration: 1.5,
                        ease: "linear",
                        onUpdate: updateUI
                    })
                    // 3. Slow crawl to 90
                    .to(progressRef.current, {
                        value: 90,
                        duration: 3,
                        ease: "power1.out",
                        onUpdate: updateUI
                    });

            } else {
                // LOADING FINISHED (current -> 100%)
                // Force finish whatever simulation was running
                if (timeline.current) timeline.current.kill();

                gsap.to(progressRef.current, {
                    value: 100,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onUpdate: updateUI,
                    onComplete: () => {
                        // Exit animation after 100%
                        gsap.to(containerRef.current, {
                            opacity: 0,
                            duration: 0.5,
                            delay: 0.2,
                            onComplete: () => setIsVisible(false)
                        });
                    }
                });
            }

            function updateUI() {
                const val = Math.round(progressRef.current.value);
                // Update Bar Width
                if (barRef.current) {
                    barRef.current.style.width = `${val}%`;
                }
                // Update Counter Text
                if (counterRef.current) {
                    // Pad with leading zero for aesthetic
                    counterRef.current.innerText = val < 10 ? `0${val}%` : `${val}%`;
                }
            }

        }, containerRef);

        return () => ctx.revert();
    }, [isLoading, isVisible]);

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#020617] text-white"
        >
            <div className="relative w-64 md:w-80">
                {/* Percentage Counter */}
                <div className="flex justify-between items-end mb-2 font-exo">
                    <span className="text-sm text-gray-500 tracking-widest">LOADING ASSETS</span>
                    <span ref={counterRef} className="text-4xl font-bold bg-linear-to-r from-[#FC1E5C] to-purple-600 bg-clip-text text-transparent">
                        00%
                    </span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    {/* Active Bar */}
                    <div
                        ref={barRef}
                        className="h-full bg-linear-to-r from-[#FC1E5C] via-purple-500 to-[#FC1E5C] w-0 shadow-[0_0_15px_rgba(252,30,92,0.5)]"
                    ></div>
                </div>

                {/* Decorative Elements */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-white/20 animate-pulse">
                        Securing connection to blockchain...
                    </p>
                </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FC1E5C] rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>
        </div>
    );
}
