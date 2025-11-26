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
      <div className="flex justify-center items-center min-h-screen">
        Error: Context not found
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">NFT Not Found</h2>
          <button
            onClick={() => navigate("/explore")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  // Check if NFT is available for purchase
  if (!transactionComplete && (nft.status !== "listed" || nft.owner !== null)) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">NFT Not Available</h2>
          <p className="text-gray-600 mb-4">
            This NFT is no longer available for purchase.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-500 hover:text-blue-600 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Complete Your Purchase
        </h1>

        {!transactionComplete ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NFT Preview Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">NFT Details</h2>
              <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">{nft.title}</h3>
              <p className="text-gray-600 mb-4">{nft.description}</p>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Creator:</span>
                  <span className="font-semibold">{nft.creator.username}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Token ID:</span>
                  <span className="font-semibold text-sm">{nft.token_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-xl text-blue-600">
                    {nft.price} ETH
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Form Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Payment Information
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="space-y-3">
                  {/* Ethereum Option */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="ethereum"
                      checked={paymentMethod === "ethereum"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                      disabled={processing}
                    />
                    <div className="ml-3 flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">⟠</span>
                        <div>
                          <p className="font-semibold">Ethereum (ETH)</p>
                          <p className="text-xs text-gray-500">
                            Fast & Secure blockchain payment
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "ethereum" && (
                        <span className="text-green-500 font-semibold">✓</span>
                      )}
                    </div>
                  </label>

                  {/* Bitcoin Option */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bitcoin"
                      checked={paymentMethod === "bitcoin"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                      disabled={processing}
                    />
                    <div className="ml-3 flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">₿</span>
                        <div>
                          <p className="font-semibold">Bitcoin (BTC)</p>
                          <p className="text-xs text-gray-500">
                            Decentralized cryptocurrency
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "bitcoin" && (
                        <span className="text-green-500 font-semibold">✓</span>
                      )}
                    </div>
                  </label>

                  {/* Bank Transfer Option */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                      disabled={processing}
                    />
                    <div className="ml-3 flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🏦</span>
                        <div>
                          <p className="font-semibold">Bank Transfer</p>
                          <p className="text-xs text-gray-500">
                            Traditional bank payment
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "bank_transfer" && (
                        <span className="text-green-500 font-semibold">✓</span>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Wallet Address Input (only for crypto) */}
              {paymentMethod !== "bank_transfer" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Wallet Address
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter wallet address (min 10 chars)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={processing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 10 characters required
                  </p>
                </div>
              )}

              {/* Bank Transfer Info */}
              {paymentMethod === "bank_transfer" && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Bank Account Details
                  </h4>
                  <div className="text-sm space-y-1 text-blue-800">
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
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">NFT Price:</span>
                    <span className="font-semibold">{nft.price} ETH</span>
                  </div>
                  {paymentMethod !== "bank_transfer" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gas Fee:</span>
                      <span className="font-semibold">
                        ~
                        {paymentMethod === "ethereum"
                          ? "0.005 ETH"
                          : "0.00005 BTC"}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-blue-600">
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
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  processing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
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
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Purchase Successful!
              </h2>
              <p className="text-gray-600">
                You are now the owner of <strong>{nft.title}</strong>
              </p>
            </div>

            {transactionData && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4">Transaction Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Transaction Hash</p>
                    <p className="font-mono text-sm break-all">
                      {transactionData.transaction_hash}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wallet Address</p>
                    <p className="font-mono text-sm break-all">
                      {transactionData.wallet_address}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Gas Fee</p>
                      <p className="font-semibold">
                        {transactionData.gas_fee} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-semibold text-blue-600">
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
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
              >
                View NFT
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="bg-gray-200 hover:bg-gray-300 py-3 rounded-lg"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
