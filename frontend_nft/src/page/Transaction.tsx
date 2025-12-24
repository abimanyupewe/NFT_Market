import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AppContext } from "../context/AppContext";

interface TransactionData {
  wallet_address: string;
  transaction_hash: string;
  gas_fee: string;
  total_price: string;
  payment_method: string;
  transaction_id?: number;
}

const Transaction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(AppContext);

  const [nft, setNFT] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("ethereum");
  const [transactionComplete, setTransactionComplete] =
    useState<boolean>(false);
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);

  // Fetch NFT data
  useEffect(() => {
    const fetchNFT = async () => {
      if (context && id) {
        setLoading(true);
        const nftId = parseInt(id);

        // Try to find in cache first
        const cachedNFT = context.nfts.find((item) => item.id === nftId);

        if (cachedNFT) {
          setNFT(cachedNFT);
          setLoading(false);
        } else {
          // Fetch from API
          const fetchedNFT = await context.getNFTById(nftId);
          if (fetchedNFT) {
            setNFT(fetchedNFT);
          }
          setLoading(false);
        }
      }
    };

    fetchNFT();
  }, [id, context]);

  // Generate dummy transaction data for UI display
  const generateDummyTransaction = () => {
    const randomHash = "0x" + Math.random().toString(16).substring(2, 66);
    const gasFee =
      paymentMethod === "ethereum"
        ? (Math.random() * 0.01 + 0.001).toFixed(6)
        : paymentMethod === "bitcoin"
          ? (Math.random() * 0.0001 + 0.00001).toFixed(8)
          : "0.00";
    const totalPrice =
      paymentMethod === "bank_transfer"
        ? parseFloat(nft.price).toFixed(2)
        : (parseFloat(nft.price) + parseFloat(gasFee)).toFixed(6);

    return {
      wallet_address: walletAddress,
      transaction_hash: randomHash,
      gas_fee: gasFee,
      total_price: totalPrice,
      payment_method: paymentMethod,
    };
  };

  const handlePurchase = async () => {
    // Validation
    if (!walletAddress && paymentMethod !== "bank_transfer") {
      toast.error("Please enter your wallet address");
      return;
    }

    if (paymentMethod !== "bank_transfer" && walletAddress.length < 10) {
      toast.error("Wallet address too short (minimum 10 characters)");
      return;
    }

    setProcessing(true);

    const transaction = generateDummyTransaction();
    console.log("Generated UI transaction data:", transaction);

    try {
      if (!context) {
        toast.error("Context not available");
        return;
      }

      console.log("=== INITIATING PURCHASE ===");
      console.log("NFT ID:", nft.id);
      console.log("Payment Method:", paymentMethod);
      console.log("Wallet Address:", walletAddress);

      // Call purchaseNFT from context (auto-map payment method)
      const success = await context.purchaseNFT({
        nft_id: nft.id,
        wallet_address: walletAddress || "dummy_wallet_" + Date.now(),
        payment_method: paymentMethod,
      });

      if (success) {
        console.log("Purchase successful");
        setTransactionData(transaction);
        setTransactionComplete(true);
        toast.success("Transaction completed successfully!");
      } else {
        console.error("Purchase failed");
        toast.error("Failed to process purchase. Please try again.");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("An error occurred while processing your purchase.");
    } finally {
      setProcessing(false);
    }
  };

  if (!context) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black-cus text-white">
        Error: Context not found
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black-cus">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FC1E5C]"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-black-cus flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">NFT Not Found</h2>
          <button
            onClick={() => navigate("/explore")}
            className="bg-linear-to-r from-[#FC1E5C] to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  if (!transactionComplete && nft.status !== "listed") {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-black-cus flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            NFT Not Available
          </h2>
          <p className="text-gray-400 mb-4">
            This NFT is no longer available for purchase.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="bg-linear-to-r from-[#FC1E5C] to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-cus pt-24 pb-10">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FC1E5C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-[#FC1E5C] hover:text-pink-400 flex items-center gap-2 font-semibold"
        >
          ← Back
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Complete Your Purchase
          </h1>

          {!transactionComplete ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* NFT Preview Card */}
              <div className="bg-[#0f172a]/30 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#1e293b]/50">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  NFT Details
                </h2>
                <div className="aspect-square bg-linear-to-br from-[#FC1E5C]/80 to-purple-600/80 rounded-xl overflow-hidden mb-4">
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {nft.title}
                </h3>
                <p className="text-gray-400 mb-4">{nft.description}</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Creator:</span>
                    <span className="font-semibold text-white">
                      {nft.creator.username}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Token ID:</span>
                    <span className="font-semibold text-white text-sm">
                      {nft.token_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-bold text-xl text-[#FC1E5C]">
                      {nft.price} ETH
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form Card */}
              <div className="bg-[#0f172a]/30 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#1e293b]/50">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Payment Information
                </h2>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Select Payment Method
                  </label>
                  <div className="space-y-3">
                    {/* Ethereum Option */}
                    <label className="flex items-center p-4 border-2 border-[#1e293b] bg-white/5 rounded-lg cursor-pointer hover:border-[#FC1E5C] transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="ethereum"
                        checked={paymentMethod === "ethereum"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-[#FC1E5C]"
                        disabled={processing}
                      />
                      <div className="ml-3 flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">⟠</span>
                          <div>
                            <p className="font-semibold text-white">
                              Ethereum (ETH)
                            </p>
                            <p className="text-xs text-gray-400">
                              Fast & Secure blockchain payment
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "ethereum" && (
                          <span className="text-[#FC1E5C] font-semibold">
                            ✓
                          </span>
                        )}
                      </div>
                    </label>

                    {/* Bitcoin Option */}
                    <label className="flex items-center p-4 border-2 border-[#1e293b] bg-white/5 rounded-lg cursor-pointer hover:border-[#FC1E5C] transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bitcoin"
                        checked={paymentMethod === "bitcoin"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-[#FC1E5C]"
                        disabled={processing}
                      />
                      <div className="ml-3 flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">₿</span>
                          <div>
                            <p className="font-semibold text-white">
                              Bitcoin (BTC)
                            </p>
                            <p className="text-xs text-gray-400">
                              Decentralized cryptocurrency
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "bitcoin" && (
                          <span className="text-[#FC1E5C] font-semibold">
                            ✓
                          </span>
                        )}
                      </div>
                    </label>

                    {/* Bank Transfer Option */}
                    <label className="flex items-center p-4 border-2 border-[#1e293b] bg-white/5 rounded-lg cursor-pointer hover:border-[#FC1E5C] transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-[#FC1E5C]"
                        disabled={processing}
                      />
                      <div className="ml-3 flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">🏦</span>
                          <div>
                            <p className="font-semibold text-white">
                              Bank Transfer
                            </p>
                            <p className="text-xs text-gray-400">
                              Traditional bank payment
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "bank_transfer" && (
                          <span className="text-[#FC1E5C] font-semibold">
                            ✓
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Wallet Address Input (only for crypto) */}
                {paymentMethod !== "bank_transfer" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Wallet Address
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter wallet address (min 10 chars)"
                      className="w-full px-4 py-2 bg-white/5 border border-[#1e293b] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FC1E5C] focus:border-transparent"
                      disabled={processing}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Minimum 10 characters required
                    </p>
                  </div>
                )}

                {/* Bank Transfer Info */}
                {paymentMethod === "bank_transfer" && (
                  <div className="mb-6 p-4 bg-[#FC1E5C]/10 border border-[#FC1E5C]/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">
                      Bank Account Details
                    </h4>
                    <div className="text-sm space-y-1 text-gray-300">
                      <p>
                        <strong>Bank:</strong> NFT Marketplace Bank
                      </p>
                      <p>
                        <strong>Account:</strong> 1234567890
                      </p>
                      <p>
                        <strong>Name:</strong> NFT Marketplace LLC
                      </p>
                      <p>
                        <strong>Reference:</strong> NFT-{nft.id}
                      </p>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                  <h3 className="font-semibold mb-3 text-white">
                    Price Breakdown
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">NFT Price:</span>
                      <span className="font-semibold text-white">
                        {nft.price} ETH
                      </span>
                    </div>
                    {paymentMethod !== "bank_transfer" && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gas Fee:</span>
                        <span className="font-semibold text-white">
                          ~
                          {paymentMethod === "ethereum"
                            ? "0.005 ETH"
                            : "0.00005 BTC"}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="font-bold text-white">Total:</span>
                      <span className="font-bold text-[#FC1E5C]">
                        {paymentMethod === "bank_transfer"
                          ? `${nft.price} USD`
                          : `${(parseFloat(nft.price) + 0.005).toFixed(6)} ETH`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  disabled={processing}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${processing
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-[#FC1E5C] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                    }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    "Confirm Purchase"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  This is a demo transaction
                </p>
              </div>
            </div>
          ) : (
            // Transaction Success Screen
            <div className="bg-[#0f172a]/30 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#1e293b]/50">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4 border-2 border-green-500">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-500 mb-2">
                  Purchase Successful!
                </h2>
                <p className="text-gray-400">
                  You are now the owner of{" "}
                  <strong className="text-white">{nft.title}</strong>
                </p>
              </div>

              {transactionData && (
                <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
                  <h3 className="font-semibold mb-4 text-white">
                    Transaction Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Transaction Hash</p>
                      <p className="font-mono text-sm break-all text-white">
                        {transactionData.transaction_hash}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Wallet Address</p>
                      <p className="font-mono text-sm break-all text-white">
                        {transactionData.wallet_address}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Gas Fee</p>
                        <p className="font-semibold text-white">
                          {transactionData.gas_fee} ETH
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="font-semibold text-[#FC1E5C]">
                          {transactionData.total_price} ETH
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/nft/${nft.id}`)}
                  className="bg-linear-to-r from-[#FC1E5C] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  View NFT
                </button>
                <button
                  onClick={() => navigate("/explore")}
                  className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
