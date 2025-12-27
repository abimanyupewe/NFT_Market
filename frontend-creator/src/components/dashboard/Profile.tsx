import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User, Mail, Shield, Camera, Edit2, Loader2, Save, X } from "lucide-react"; // Added icons
import { Textarea } from "../ui/textarea";

export default function Profile() {
    const { user, creatorProfile, getCreatorProfile, updateCreatorProfile } = useContext(AppContext)!;
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form Stats
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getCreatorProfile();
    }, []);

    useEffect(() => {
        if (creatorProfile) {
            setName(creatorProfile.user.username || user?.username || "");
            // Note: Creator interface in AppContext might vary, check serializer. 
            // Serializer: name, bio, profile_image. 
            // AppContext Creator type: pk, user: {username}, bio, profile_image...
            setBio(creatorProfile.bio || "");
            setPreviewImage(creatorProfile.profile_image || null);
        } else if (user) {
            setName(user.username);
        }
    }, [creatorProfile, user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        if (image) {
            formData.append("profile_image", image);
        }

        const success = await updateCreatorProfile(formData);
        if (success) {
            setEditMode(false);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setEditMode(false);
        // Reset to original
        if (creatorProfile) {
            setName(creatorProfile.user.username || user?.username || "");
            setBio(creatorProfile.bio || "");
            setPreviewImage(creatorProfile.profile_image || null);
        }
        setImage(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your public profile and account information
                    </p>
                </div>
                {!editMode && (
                    <Button onClick={() => setEditMode(true)} variant="outline" className="gap-2">
                        <Edit2 className="w-4 h-4" /> Edit Profile
                    </Button>
                )}
            </div>

            <Card className="bg-secondary/5 border-white/5 text-white">
                <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Profile Header & Image */}
                    <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/10 pb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-black/40 flex items-center justify-center">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-primary">
                                        {name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {editMode && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer"
                                >
                                    <Camera className="w-8 h-8 text-white" />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            {editMode ? (
                                <div className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label>Display Name</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-black/20 border-white/10 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bio</Label>
                                        <Textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            className="bg-black/20 border-white/10 text-white min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-white">{creatorProfile?.user?.username || user?.username}</h3>
                                    <p className="text-muted-foreground max-w-xl">
                                        {creatorProfile?.bio || "No bio added yet."}
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                            <Shield className="w-3 h-3" /> {user?.role}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Account Info (Read Only mostly) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Username (Login)</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={user?.username || ''}
                                    className="pl-10 bg-black/20 border-white/10 text-white disabled:opacity-70"
                                    disabled
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={user?.email || ''}
                                    className="pl-10 bg-black/20 border-white/10 text-white disabled:opacity-70"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {editMode && (
                        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                            <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Wallet Section if available */}
            {creatorProfile?.user?.username && (
                <Card className="bg-secondary/5 border-white/5 text-white">
                    <CardHeader>
                        <CardTitle>Stats Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                            <p className="text-sm text-muted-foreground">Total Sales</p>
                            <p className="text-2xl font-bold">{creatorProfile.total_sales}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                            <p className="text-sm text-muted-foreground">Created NFTs</p>
                            <p className="text-2xl font-bold">{creatorProfile.total_created}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
