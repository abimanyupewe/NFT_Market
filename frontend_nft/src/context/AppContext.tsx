import { createContext, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";

export interface NFT {
  pk: number;
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  status: string;
  owner: { username: string } | null;
  creator: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  token_id: string;
  contract_address: string;
  created_at: string;
  updated_at: string;
  listing_date?: string;
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

interface AppContextType {
  nfts: NFT[];
  creators: Creator[];
  loading: boolean;
  error: string | null;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<User | null>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  refreshNFTs: () => void;
  refreshCreators: () => void;
  getNFTById: (id: number) => Promise<NFT | null>;
  purchaseNFT: (purchaseData: {
    nft_id: number;
    wallet_address: string;
    payment_method: string;
  }) => Promise<boolean>;
  // Dashboard Methods
  getDashboardStats: () => Promise<DashboardStats | null>;
  getMyNFTs: () => Promise<NFT[]>;
  getMyCollection: () => Promise<NFT[]>;
  createNFT: (data: FormData) => Promise<boolean>;
  updateNFT: (id: number, data: FormData) => Promise<boolean>;
  deleteNFT: (id: number) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Auth Methods
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
        const userData: User = {
          id: data.user_id,
          username: data.username,
          email: data.email,
          role: data.role, // Assuming backend now returns role
        };
        setToken(data.token);
        setUser(userData);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Login successful!");
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
      const res = await fetch(`${backendUrl}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto login or just notify? Let's auto login if token provided, else notify
        if (data.token) {
          const userData = {
            id: data.user_id,
            username: data.username,
            email: data.email,
          };
          setToken(data.token);
          setUser(userData);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(userData));
        }
        toast.success(data.message || "Registration successful!");
        return true;
      } else {
        // Handle validation errors
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    // Optional: window.location.href = '/login';
  };

  const getDataNFTs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/nfts/`);
      if (res.ok) {
        const data = await res.json();
        const results = data.results || data;
        // Filter out 'sold' NFTs
        const availableNFTs = Array.isArray(results)
          ? results.filter((nft: NFT) => nft.status !== 'sold')
          : [];

        setNFTs(availableNFTs);
        console.log("NFTs from backend (filtered):", availableNFTs);
        // toast.success("NFTs loaded successfully");
      } else {
        toast.error("Failed to fetch NFTs");
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error("An error occurred while fetching NFTs");
    } finally {
      setLoading(false);
    }
  };

  const getDataCreator = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/creator-profiles/`);

      console.log("Creator API Response Status:", res.status); // Debug

      if (res.ok) {
        const data = await res.json();
        console.log("Raw Creators Data:", data); // Debug
        const creatorsArray = data.results || data || [];

        console.log("Processed Creators Array:", creatorsArray); // Debug

        setCreators(creatorsArray);
        // toast.success("Creators loaded successfully");
      } else {
        console.error("Failed to fetch creators, status:", res.status);
        toast.error("Failed to fetch creators");
        setCreators([]);
      }
    } catch (err: unknown) {
      console.error("Creator fetch error:", err);
      toast.error("An error occurred while fetching creators");
      setCreators([]);
    } finally {
      setLoading(false);
    }
  };

  const getNFTById = async (id: number): Promise<NFT | null> => {
    try {
      const res = await fetch(`${backendUrl}/api/nfts/${id}/`);
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        console.error("Failed to fetch NFT details");
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const purchaseNFT = async (purchaseData: {
    nft_id: number;
    wallet_address: string;
    payment_method: string;
  }): Promise<boolean> => {
    if (!token) {
      toast.error("Please login to purchase NFT");
      return false;
    }

    try {
      // MAP payment_method: frontend (ethereum, bitcoin, bank_transfer) -> backend (eth, btc, usdt)
      const paymentMethodMap: Record<string, string> = {
        ethereum: "eth",
        bitcoin: "btc",
        bank_transfer: "eth",
      };

      const mappedPaymentMethod =
        paymentMethodMap[purchaseData.payment_method] || "eth";

      console.log("=== PURCHASE NFT REQUEST ===");
      console.log("NFT ID:", purchaseData.nft_id);
      console.log("Wallet Address:", purchaseData.wallet_address);
      console.log("Payment Method (original):", purchaseData.payment_method);
      console.log("Payment Method (mapped):", mappedPaymentMethod);

      const url = `${backendUrl}/api/nfts/${purchaseData.nft_id}/buy/`;
      console.log("Request URL:", url);

      const requestBody = {
        wallet_address: purchaseData.wallet_address,
        payment_method: mappedPaymentMethod,
      };
      console.log("Request Body:", requestBody);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response Status:", res.status);
      console.log("Response Headers:", Array.from(res.headers.entries()));

      if (res.ok) {
        const data = await res.json();
        console.log("=== PURCHASE SUCCESS ===");
        console.log("Response Data:", data);

        toast.success(data.message || "Purchase completed successfully!");
        getDataNFTs();
        return true;
      } else {
        const errorData = await res.json().catch(() => ({ error: "Purchase failed" }));
        console.error("Purchase failed:", errorData);
        toast.error(errorData.error || "Purchase failed");
        return false;
      }
    } catch (err: unknown) {
      console.error("=== PURCHASE EXCEPTION ===");
      console.error("Error:", err);
      toast.error("Network error occurred while processing purchase");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Dashboard Implementations
  const getDashboardStats = async (): Promise<DashboardStats | null> => {
    if (!token) return null;
    try {
      const res = await fetch(`${backendUrl}/api/creator-profiles/dashboard_stats/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.error("Error fetching stats:", err);
      return null;
    }
  };

  const getMyNFTs = async (): Promise<NFT[]> => {
    if (!token || !user?.id) return [];
    try {
      // Filter by creator ID directly using Django Filter Backend
      const res = await fetch(`${backendUrl}/api/nfts/?creator=${user.id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.results || data || [];
      }
      return [];
    } catch (err) {
      console.error("Error fetching my NFTs:", err);
      return [];
    }
  };

  const getMyCollection = async (): Promise<NFT[]> => {
    if (!token || !user?.id) return [];
    try {
      // Filter by owner ID (NFTs owned/collected by user)
      const res = await fetch(`${backendUrl}/api/nfts/?owner=${user.id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.results || data || [];
      }
      return [];
    } catch (err) {
      console.error("Error fetching my collection:", err);
      return [];
    }
  };

  const createNFT = async (data: FormData): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/nfts/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
        body: data,
      });

      if (res.ok) {
        toast.success("NFT Created successfully!");
        getDataNFTs();
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
    } finally {
      setLoading(false);
    }
  };

  const updateNFT = async (id: number, data: FormData): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/nfts/${id}/`, {
        method: "PATCH",
        headers: { Authorization: `Token ${token}` },
        body: data,
      });

      if (res.ok) {
        toast.success("NFT Updated successfully!");
        getDataNFTs();
        return true;
      } else {
        toast.error("Failed to update NFT");
        return false;
      }
    } catch (err) {
      console.error("Update NFT Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteNFT = async (id: number): Promise<boolean> => {
    if (!confirm("Are you sure you want to delete this NFT?")) return false;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/nfts/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (res.ok) {
        toast.success("NFT Deleted");
        getDataNFTs();
        return true;
      } else {
        toast.error("Failed to delete NFT");
        return false;
      }
    } catch (err) {
      console.error("Delete NFT Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataNFTs();
    getDataCreator();
  }, []);

  const value = {
    nfts,
    creators,
    loading,
    error,
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    refreshNFTs: getDataNFTs,
    refreshCreators: getDataCreator,
    getNFTById,
    purchaseNFT,
    getDashboardStats,
    getMyCollection,
    getMyNFTs,
    createNFT,
    updateNFT,
    deleteNFT,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
