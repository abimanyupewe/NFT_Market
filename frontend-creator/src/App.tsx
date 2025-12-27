import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import CreateNFT from "./components/dashboard/CreateNFT";
import MyNFTs from "./components/dashboard/MyNFTs";
import Profile from "./components/dashboard/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHome from "./pages/DashboardHome"; // Import the new page

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AppContext)!;

  if (loading) return <div className="text-white">Loading...</div>; // Or a spinner
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="create-nft" element={<CreateNFT />} />
            <Route path="edit-nft/:id" element={<CreateNFT />} />
            <Route path="my-nfts" element={<MyNFTs />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
