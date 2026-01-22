import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface LoginRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#020617] p-0 shadow-2xl shadow-primary/10">
                            {/* Decorative Elements */}
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"></div>
                            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl"></div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="relative p-8 flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                                    <ShieldAlert className="h-10 w-10 text-red-500" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 font-exo">
                                    Authentication Required
                                </h3>

                                <p className="text-neutral-400 mb-8 leading-relaxed">
                                    You need to be logged in to purchase NFTs. Join our community of collectors and start building your digital art collection today.
                                </p>

                                <div className="flex w-full flex-col gap-3">
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            navigate("/sign-in");
                                        }}
                                        className="h-12 w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all group"
                                    >
                                        <LogIn className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        Log In / Sign Up
                                    </Button>

                                    <Button
                                        onClick={onClose}
                                        variant="outline"
                                        className="h-12 w-full rounded-xl border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white font-medium transition-all"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
