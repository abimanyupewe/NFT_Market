import { createContext, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";

interface NFT {
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
}

interface Creator {
  pk: number;
  user: { username: string };
  bio: string;
  profile_image: { url: string };
}

interface AppContextType {
  nfts: NFT[];
  creators: Creator[];
  loading: boolean;
  error: string | null;
  refreshNFTs: () => void;
  refreshCreators: () => void;
  getNFTById: (id: number) => Promise<NFT | null>;
  purchaseNFT: (purchaseData: {
    nft_id: number;
    wallet_address: string;
    payment_method: string;
  }) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";

  const getDataNFTs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/nfts/`);
      if (res.ok) {
        const data = await res.json();
        setNFTs(data.results || data);
        console.log("NFTs from backend:", data);
        toast.success("NFTs loaded successfully");
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
      const res = await fetch(`${backendUrl}api/creator-profiles/`);
      if (res.ok) {
        const data = await res.json();
        setCreators(data.results);
        console.log("Creators from backend:", data);
        toast.success("Creators loaded successfully");
      } else {
        toast.error("Failed to fetch creators");
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error("An error occurred while fetching creators");
    } finally {
      setLoading(false);
    }
  };

  const getNFTById = async (id: number): Promise<NFT | null> => {
    console.log("Fetching NFT by ID:", id);
    try {
      const res = await fetch(`${backendUrl}/api/nfts/${id}/`);
      if (res.ok) {
        const data = await res.json();
        console.log("NFT Detail from backend:", data);
        return data;
      } else {
        console.error("Failed to fetch NFT details, status:", res.status);
        toast.error("Failed to fetch NFT details");
        return null;
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error("An error occurred while fetching NFT details");
      return null;
    }
  };

  const purchaseNFT = async (purchaseData: {
    nft_id: number;
    wallet_address: string;
    payment_method: string;
  }): Promise<boolean> => {
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

      const url = `${backendUrl}api/nfts/${purchaseData.nft_id}/buy/`;
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
          Authorization: `Token ba86004d902cac52e3c73b3bf8c80cd6c1d9e260`,
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

        // Refresh NFTs to update UI
        await getDataNFTs();

        return true;
      } else {
        console.log("=== PURCHASE FAILED ===");

        const contentType = res.headers.get("content-type");
        let errorMessage = "Failed to process purchase";

        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await res.json();
            console.error("Error Data:", errorData);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            console.error("Failed to parse error JSON:", e);
          }
        } else {
          const errorText = await res.text();
          console.error("Error Text (non-JSON):", errorText);
        }

        toast.error(errorMessage);
        return false;
      }
    } catch (err: unknown) {
      console.error("=== PURCHASE EXCEPTION ===");
      console.error("Error:", err);
      toast.error("Network error occurred while processing purchase");
      return false;
    }
  };

  useEffect(() => {
    getDataNFTs();
    getDataCreator();
  }, []);

  return (
    <AppContext.Provider
      value={{
        nfts,
        creators,
        loading,
        error,
        refreshNFTs: getDataNFTs,
        refreshCreators: getDataCreator,
        getNFTById,
        purchaseNFT,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
