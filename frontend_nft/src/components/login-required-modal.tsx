import { useEffect, useRef } from "react";
import { X, LogIn, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

interface LoginRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    // Initialize Animation Context
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });

            // Initial Set
            gsap.set(backdropRef.current, { opacity: 0 });
            gsap.set(modalRef.current, { scale: 0.9, opacity: 0, y: 20 });
            gsap.set(".stagger-item", { y: 20, opacity: 0 });

            // Build Timeline
            tl.to(backdropRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            })
                .to(modalRef.current, {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "back.out(1.5)"
                }, "-=0.2")
                .to(".stagger-item", {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out"
                }, "-=0.3");

            timeline.current = tl;
        }, modalRef); // Scope to modalRef is mainly for .stagger-item selector

        return () => ctx.revert();
    }, []);

    // Handle Open/Close
    useEffect(() => {
        if (timeline.current) {
            if (isOpen) {
                timeline.current.play();
            } else {
                timeline.current.reverse();
            }
        }
    }, [isOpen]);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-none ${isOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
        >
            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 cursor-pointer"
            />

            {/* Modal Container */}
            <div
                ref={modalRef}
                className="relative w-full max-w-md px-4 opacity-0"
            >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#020617] p-0 shadow-2xl shadow-primary/10">

                    {/* Decorative Elements */}
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl animate-pulse pointer-events-none"></div>
                    <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl animate-pulse pointer-events-none"></div>

                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="relative p-8 flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className="stagger-item mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-red-500/20 to-orange-500/20 border border-red-500/20 translate-y-4 opacity-0">
                            <ShieldAlert className="h-10 w-10 text-red-500" />
                        </div>

                        <h3 className="stagger-item text-3xl font-bold text-white mb-3 font-exo translate-y-4 opacity-0">
                            Authentication Required
                        </h3>

                        <p className="stagger-item text-neutral-400 mb-8 leading-relaxed translate-y-4 opacity-0">
                            Access to this feature is restricted to registered members. Join our elite community of collectors.
                        </p>

                        <div className="stagger-item flex w-full flex-col gap-3 translate-y-4 opacity-0">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                    navigate("/sign-in");
                                }}
                                className="h-14 w-full rounded-2xl bg-linear-to-r from-primary to-pink-600 hover:to-primary text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all group overflow-hidden relative cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    <LogIn className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    Log In / Sign Up
                                </span>
                            </Button>

                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                variant="outline"
                                className="h-12 w-full rounded-2xl border-white/5 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white font-medium transition-all cursor-pointer"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
