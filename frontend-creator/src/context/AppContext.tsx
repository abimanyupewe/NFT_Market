import { createContext, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";

// Types
export interface NFT {
    pk: number;
    id: number;
    title: string;
    description: string;
    image: string;
    price: string;
    status: string;
    token_id: string;
    contract_address: string;
    created_at: string;
    updated_at: string;
    listing_date?: string;
    creator: {
        id: number;
        username: string;
        email: string;
    };
}

export interface Creator {
    pk: number;
    user: { username: string };
    bio: string;
    profile_image: string;
    total_sales: string;
    total_created: number;
}

interface User {
    id: number;
    username: string;
    email: string;
    role?: string;
}

interface DashboardStats {
    total_created: number;
    total_sales_count: number;
    total_buyers: number;
    total_earnings: string;
}

// Context Interface
interface AppContextType {
    loading: boolean;
    error: string | null;
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Auth
    login: (data: any) => Promise<User | null>;
    register: (data: any) => Promise<boolean>;
    logout: () => void;

    // Dashboard Data
    nfts: NFT[]; // My NFTs
    dashboardStats: DashboardStats | null;
    creatorProfile: Creator | null;
    getDashboardStats: () => Promise<DashboardStats | null>;
    getCreatorProfile: () => Promise<Creator | null>;
    updateCreatorProfile: (data: FormData) => Promise<boolean>;
    getMyNFTs: () => Promise<NFT[]>;
    refreshData: () => void;

    // Actions
    createNFT: (data: FormData) => Promise<boolean>;
    updateNFT: (id: number, data: FormData) => Promise<boolean>;
    deleteNFT: (id: number) => Promise<boolean>;
    getNFTById: (id: number) => Promise<NFT | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Data State
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [creatorProfile, setCreatorProfile] = useState<Creator | null>(null);

    // Auth State
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });

    const backendUrl =
        (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

    // --- Auth Methods ---

    const login = async (credentials: any): Promise<User | null> => {
        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.role !== 'author') {
                    toast.error("Access denied. Creator account required.");
                    return null;
                }

                const userData: User = {
                    id: data.user_id,
                    username: data.username,
                    email: data.email,
                    role: data.role,
                };
                setToken(data.token);
                setUser(userData);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(userData));
                toast.success("Welcome back, Creator!");
                return userData;
            } else {
                toast.error(data.non_field_errors?.[0] || "Login failed");
                return null;
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error during login");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const register = async (inputData: any) => {
        setLoading(true);
        try {
            // Force role to author for this frontend
            const payload = { ...inputData, role: 'author' };

            const res = await fetch(`${backendUrl}/api/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.token) {
                    const userData = {
                        id: data.user_id,
                        username: data.username,
                        email: data.email,
                        role: 'author'
                    };
                    setToken(data.token);
                    setUser(userData);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(userData));
                }
                toast.success("Creator Account Created!");
                return true;
            } else {
                const errorMsg = Object.values(data).flat().join(", ");
                toast.error(errorMsg || "Registration failed");
                return false;
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error during registration");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setNfts([]);
        setDashboardStats(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
    };

    // --- Data Methods ---

    // --- Data Methods ---

    const getDashboardStats = async (): Promise<DashboardStats | null> => {
        if (!token) return null;
        try {
            const res = await fetch(`${backendUrl}/api/creator-profiles/dashboard_stats/`, {
                headers: { Authorization: `Token ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setDashboardStats(data);
                return data;
            }
            return null;
        } catch (err) {
            console.error("Error fetching stats:", err);
            return null;
        }
    };

    const getCreatorProfile = async (): Promise<Creator | null> => {
        if (!token) return null;
        try {
            const res = await fetch(`${backendUrl}/api/creator-profiles/me/`, {
                headers: { Authorization: `Token ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCreatorProfile(data);
                return data;
            }
            return null;
        } catch (err) {
            console.error("Error fetching creator profile:", err);
            return null;
        }
    };

    const updateCreatorProfile = async (data: FormData): Promise<boolean> => {
        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/creator-profiles/me/`, {
                method: "PATCH",
                headers: { Authorization: `Token ${token}` },
                body: data,
            });

            if (res.ok) {
                toast.success("Profile updated successfully!");
                getCreatorProfile();
                return true;
            } else {
                toast.error("Failed to update profile");
                return false;
            }
        } catch (err) {
            console.error("Update profile error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getMyNFTs = async (): Promise<NFT[]> => {
        if (!token || !user?.id) return [];

        try {
            const res = await fetch(`${backendUrl}/api/nfts/?creator=${user.id}`, {
                headers: { Authorization: `Token ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                const results = data.results || data || [];
                setNfts(results);
                return results;
            }
            return [];
        } catch (err) {
            console.error("Error fetching my NFTs:", err);
            return [];
        }
    };

    const createNFT = async (data: FormData): Promise<boolean> => {
        try {
            const res = await fetch(`${backendUrl}/api/nfts/`, {
                method: "POST",
                headers: { Authorization: `Token ${token}` },
                body: data,
            });

            if (res.ok) {
                toast.success("NFT Created successfully!");
                getMyNFTs(); // Refresh list
                getDashboardStats(); // Refresh stats
                return true;
            } else {
                const errData = await res.json();
                console.error("Create NFT Error:", errData);
                toast.error("Failed to create NFT");
                return false;
            }
        } catch (err) {
            console.error("Create NFT Network Error:", err);
            toast.error("Network error");
            return false;
        }
    };

    const updateNFT = async (id: number, data: FormData): Promise<boolean> => {
        try {
            const res = await fetch(`${backendUrl}/api/nfts/${id}/`, {
                method: "PATCH",
                headers: { Authorization: `Token ${token}` },
                body: data,
            });

            if (res.ok) {
                toast.success("NFT Updated successfully!");
                getMyNFTs();
                return true;
            } else {
                toast.error("Failed to update NFT");
                return false;
            }
        } catch (err) {
            console.error("Update NFT Error:", err);
            return false;
        }
    };

    const deleteNFT = async (id: number): Promise<boolean> => {
        if (!confirm("Are you sure you want to delete this NFT?")) return false;
        try {
            const res = await fetch(`${backendUrl}/api/nfts/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Token ${token}` },
            });

            if (res.ok) {
                toast.success("NFT Deleted");
                getMyNFTs();
                getDashboardStats();
                return true;
            } else {
                toast.error("Failed to delete NFT");
                return false;
            }
        } catch (err) {
            console.error("Delete NFT Error:", err);
            return false;
        }
    };

    const getNFTById = async (id: number): Promise<NFT | null> => {
        try {
            const res = await fetch(`${backendUrl}/api/nfts/${id}/`);
            if (res.ok) {
                const data = await res.json();
                return data;
            } else {
                return null;
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const refreshData = () => {
        getDashboardStats();
        getCreatorProfile();
        getMyNFTs();
    };

    useEffect(() => {
        if (token) {
            refreshData();
        }
    }, [token]);

    const value = {
        loading,
        error,
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        nfts,
        dashboardStats,
        creatorProfile,
        getDashboardStats,
        getCreatorProfile,
        updateCreatorProfile,
        getMyNFTs,
        refreshData,
        createNFT,
        updateNFT,
        deleteNFT,
        getNFTById,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
