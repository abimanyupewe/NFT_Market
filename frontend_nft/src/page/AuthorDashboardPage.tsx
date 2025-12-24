
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";

import { StatsGrid } from "../components/dashboard/StatsGrid";
import { NFTTable } from "../components/dashboard/NFTTable";

export default function AuthorDashboardPage() {
    const {
        user,
        isAuthenticated,
        getDashboardStats,
        getMyNFTs,
        deleteNFT,
        token
    } = useContext(AppContext)!;

    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [myNFTs, setMyNFTs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/sign-in-author");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsData, nftsData] = await Promise.all([
                    getDashboardStats(),
                    getMyNFTs()
                ]);
                setStats(statsData);
                setMyNFTs(nftsData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, token]);

    const handleDelete = async (id: number) => {
        const success = await deleteNFT(id);
        if (success) {
            // Refresh list
            const updatedNFTs = await getMyNFTs();
            setMyNFTs(updatedNFTs);
            // Refresh stats
            const updatedStats = await getDashboardStats();
            setStats(updatedStats);
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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Overview</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, <span className="text-primary font-semibold">{user?.username}</span>
                    </p>
                </div>
            </div>

            {/* Stats */}
            <StatsGrid stats={stats} />

            {/* My Collections */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Recent Collections</h2>
                    <Button
                        onClick={() => navigate("/author/create-nft")}
                        variant="outline"
                        className="text-primary border-primary/20 hover:bg-primary/20 bg-transparent"
                    >
                        <Plus className="w-4 h-4 mr-2" /> View All
                    </Button>
                </div>

                <NFTTable nfts={myNFTs} onDelete={handleDelete} />
            </div>
        </div>
    );
}

