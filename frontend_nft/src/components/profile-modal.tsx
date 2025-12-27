import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Button } from "./ui/button";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, logout, userProfile } = useContext(AppContext)!;

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
                        className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-100 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black-cus p-0">

                            <div className="p-6">
                                {/* Avatar - Centered Static */}
                                <div className="flex justify-center mb-4">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-black-cus bg-black-cus shadow-xl overflow-hidden">
                                        {userProfile?.profile_image ? (
                                            <img
                                                src={userProfile.profile_image}
                                                alt={user?.username}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/80 to-purple-600/80 text-4xl font-bold text-white">
                                                {user?.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">
                                        {user?.username}
                                    </h3>
                                    <p className="text-sm font-medium text-neutral-400 mb-3">{user?.email}</p>
                                </div>

                                <div className="flex w-full flex-col gap-3">
                                    <Button
                                        onClick={() => {
                                            window.location.href = "/my-collection";
                                            onClose();
                                        }}
                                        variant="outline"
                                        className="h-11 w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white font-medium transition-all"
                                    >
                                        My Collection
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            window.location.href = "/edit-profile";
                                            onClose();
                                        }}
                                        variant="outline"
                                        className="h-11 w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white font-medium transition-all"
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            logout();
                                            onClose();
                                        }}
                                        className="h-11 w-full rounded-xl bg-primary hover:bg-primary/80 font-medium transition-all"
                                    >
                                        Sign Out
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
