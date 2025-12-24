import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User, Mail, Shield, Image as ImageIcon } from "lucide-react";
import { NFTTable } from "./NFTTable";

export default function Profile() {
    const { user, getMyNFTs, deleteNFT } = useContext(AppContext)!;
    const [myNFTs, setMyNFTs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNFTs = async () => {
            setLoading(true);
            try {
                const data = await getMyNFTs();
                setMyNFTs(data);
            } catch (error) {
                console.error("Failed to load NFTs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [getMyNFTs]);

    const handleDelete = async (id: number) => {
        const success = await deleteNFT(id);
        if (success) {
            const updatedNFTs = await getMyNFTs();
            setMyNFTs(updatedNFTs);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account information and preferences
                </p>
            </div>

            <Card className="bg-secondary/5 border-white/5 text-white">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">{user?.username}</h3>
                            <p className="text-muted-foreground capitalize flex items-center gap-2 mt-1">
                                <Shield className="w-4 h-4" /> {user?.role}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={user?.username || ''}
                                    className="pl-10 bg-black/20 border-white/10 text-white"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={user?.email || ''}
                                    className="pl-10 bg-black/20 border-white/10 text-white"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input
                                value={user?.role || 'User'}
                                className="bg-black/20 border-white/10 text-white capitalize"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <Button className="bg-primary hover:bg-primary/90">
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-secondary/5 border-white/5 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        My Collection
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading collection...</div>
                    ) : (
                        <NFTTable nfts={myNFTs} onDelete={handleDelete} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
