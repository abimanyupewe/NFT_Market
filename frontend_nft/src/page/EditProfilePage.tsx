import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { NavbarSection } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ArrowLeft, Camera, Loader2, Save, User, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EditProfilePage() {
    const { user, userProfile, getUserProfile, updateUserProfile } = useContext(AppContext)!;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        getUserProfile();
    }, []);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name || user?.username || "");
            setBio(userProfile.bio || "");
            setPreviewImage(userProfile.profile_image || null);
        } else if (user) {
            setName(user.username);
        }
    }, [userProfile, user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        if (image) {
            formData.append("profile_image", image);
        }

        const success = await updateUserProfile(formData);
        setLoading(false);

        if (success) {
            // Optional: Navigate back or just show success (already handled in context)
            // navigate("/"); 
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary text-white font-body selection:bg-pink-500/30">
            <NavbarSection />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <Link to="/" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="max-w-2xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                            Edit Profile
                        </h1>
                        <p className="text-neutral-400">
                            Update your personal information and public profile
                        </p>
                    </div>

                    <div className="bg-secondary/10 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                        <form onSubmit={handleSave} className="space-y-8">

                            {/* Profile Image */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/5 bg-black/40 flex items-center justify-center shadow-inner">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-primary">
                                                {name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer text-white font-medium"
                                    >
                                        <Camera className="w-6 h-6 mr-2" /> Change
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <p className="text-sm text-neutral-500">Allowed *.jpeg, *.jpg, *.png, *.gif</p>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300">Display Name</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-black/20 border-white/10 text-white h-12 focus:border-primary/50 transition-colors"
                                        placeholder="Enter your display name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300">Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell the world about yourself..."
                                        className="w-full min-h-[120px] rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-300">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
                                            <Input
                                                value={user?.username || ''}
                                                disabled
                                                className="pl-10 bg-white/5 border-transparent text-neutral-400 h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-300">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
                                            <Input
                                                value={user?.email || ''}
                                                disabled
                                                className="pl-10 bg-white/5 border-transparent text-neutral-400 h-11"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/")}
                                    className="flex-1 h-12 rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" /> Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
