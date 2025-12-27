import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { NFTTable } from "./NFTTable";
import { toast } from "react-hot-toast";

export default function MyNFTs() {
    const { getMyNFTs, deleteNFT, user } = useContext(AppContext)!;
    const [myNFTs, setMyNFTs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNFTs = async () => {
            setLoading(true);
            try {
                const data = await getMyNFTs();
                setMyNFTs(data);
            } catch (error) {
                console.error("Failed to load NFTs", error);
                toast.error("Failed to load your collection");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNFTs();
        }
    }, [user]);

    const handleDelete = async (id: number) => {
        const success = await deleteNFT(id);
        if (success) {
            const updatedNFTs = await getMyNFTs();
            setMyNFTs(updatedNFTs);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Collection</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your created NFTs and artwork
                    </p>
                </div>
            </div>

            <div className="bg-secondary/5 rounded-xl border border-white/5 overflow-hidden">
                <NFTTable nfts={myNFTs} onDelete={handleDelete} />
            </div>
        </div>
    );
}
