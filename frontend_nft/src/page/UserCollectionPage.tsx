import { useContext, useEffect, useState } from "react";
import { AppContext, type NFT } from "../context/AppContext";
import { NFTCard } from "../components/NFTCard";

export default function UserCollectionPage() {
    const { getMyCollection } = useContext(AppContext)!;
    const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNFTs = async () => {
            setLoading(true);
            try {
                const data = await getMyCollection();
                setMyNFTs(data);
            } catch (error) {
                console.error("Failed to load user collection", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [getMyCollection]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black-cus pt-32 pb-10 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black-cus pt-32 pb-10 px-4 md:px-10">
            <div className="container mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Collection</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Here are the digital assets you have collected.
                    </p>
                </div>

                {myNFTs.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <p className="text-xl text-gray-300">You don't have any NFTs yet.</p>
                        <p className="text-gray-500 mt-2">Explore the marketplace to start your collection!</p>
                        <a href="/explore" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition text-sm font-semibold">
                            Explore Marketplace
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {myNFTs.map((nft) => (
                            <NFTCard key={nft.id} nft={nft} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
