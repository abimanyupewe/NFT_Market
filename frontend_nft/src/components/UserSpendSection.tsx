import { useEffect, useState } from "react";

interface UserProfile {
    id: number;
    user: {
        username: string;
        email: string;
    };
    name: string;
    bio: string;
    profile_image: string;
    total_spent: string;
    assets_count: number;
}

const UserSpendSection = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopSpenders = async () => {
            try {
                const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
                const res = await fetch(`${backendUrl}/api/user-profiles/`);
                if (!res.ok) throw new Error("Failed to fetch user profiles");

                const data = await res.json();
                const profiles = Array.isArray(data) ? data : (data.results || []);

                // Filter users who have spent money and sort by total_spent desc
                const sortedUsers = profiles
                    .filter((u: UserProfile) => parseFloat(u.total_spent || "0") > 0)
                    .sort((a: UserProfile, b: UserProfile) => parseFloat(b.total_spent || "0") - parseFloat(a.total_spent || "0"))
                    .slice(0, 10); // Take top 10

                setUsers(sortedUsers);
            } catch (err) {
                console.error("Error fetching top spenders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopSpenders();
    }, []);

    if (loading) return (
        <div className="w-full bg-black-cus py-16 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
    // Or a loading spinner

    return (
        <div className="w-full bg-black-cus py-16 text-white relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FC1E5C] rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        Top Collectors
                    </h2>
                    <p className="text-gray-400">
                        The biggest contributors to the marketplace
                    </p>
                </div>

                {users.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-10 border border-dashed border-gray-800 rounded-2xl">
                        <p className="text-xl">No collectors found yet</p>
                        <p className="text-sm mt-2">Be the first to collect an NFT!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user, index) => (
                            <div
                                key={user.id}
                                className="group flex items-center gap-4 bg-[#0f172a]/40 backdrop-blur-sm border border-[#1e293b]/50 p-4 rounded-2xl hover:border-[#FC1E5C]/50 transition-all duration-300"
                            >
                                <div className="shrink-0 relative">
                                    <span className={`absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                        index === 1 ? 'bg-gray-300 text-black' :
                                            index === 2 ? 'bg-orange-700 text-white' : 'bg-gray-700 text-white'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <img
                                        src={
                                            user.profile_image?.startsWith("http")
                                                ? user.profile_image
                                                : user.profile_image
                                                    ? `${(import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "")}${user.profile_image}`
                                                    : "/placeholder-user.png"
                                        }
                                        alt={user.user.username}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-700 group-hover:border-[#FC1E5C] transition-colors"
                                        onError={(e) => {
                                            e.currentTarget.src = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' dominant-baseline='middle' text-anchor='middle'%3E${user.user.username.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
                                        }}
                                    />
                                </div>

                                <div className="grow min-w-0">
                                    <h3 className="font-bold text-lg text-white truncate group-hover:text-[#FC1E5C] transition-colors">
                                        {user.name || user.user.username}
                                    </h3>
                                    <p className="text-gray-400 text-sm truncate">@{user.user.username}</p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <div className="text-[#FC1E5C] font-bold text-lg">
                                        {user.total_spent} ETH
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {user.assets_count} NFTs
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSpendSection;
