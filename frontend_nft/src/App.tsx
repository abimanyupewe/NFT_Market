// import { Routes } from "react-router-dom";
import { NavbarSection } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import LoginAuthorPage from "./page/LoginAuthorPage";
import RegisterAuthorPage from "./page/RegisterAuthorPage";
import AuthorDashboardPage from "./page/AuthorDashboardPage";
import Home from "./page/Home";
import Collection from "./page/Collection";
import Auctions from "./page/Auctions";
import NFTDetail from "./page/NFTDetail";
import Explore from "./page/Explore";
import Transaction from "./page/Transaction";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import CreateNFT from "./components/dashboard/CreateNFT";
import MyNFTs from "./components/dashboard/MyNFTs.tsx";
import Profile from "./components/dashboard/Profile.tsx";
import UserCollectionPage from "./page/UserCollectionPage";

function App() {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith("/author");

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            {!isDashboard && <NavbarSection />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<LoginPage />} />
                <Route path="/sign-up" element={<RegisterPage />} />
                <Route path="/sign-in-author" element={<LoginAuthorPage />} />
                <Route path="/sign-up-author" element={<RegisterAuthorPage />} />
                <Route path="/author" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<AuthorDashboardPage />} />
                    <Route path="create-nft" element={<CreateNFT />} />
                    <Route path="edit-nft/:id" element={<CreateNFT />} />
                    <Route path="my-nfts" element={<MyNFTs />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="/explore" element={<Explore />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/nft/:id" element={<NFTDetail />} />
                <Route path="/transaction/:id" element={<Transaction />} />
                <Route path="/my-collection" element={<UserCollectionPage />} />
            </Routes>
            {!isDashboard && <Footer />}
        </>
    );
}

export default App;
