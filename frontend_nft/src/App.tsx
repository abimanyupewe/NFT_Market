// import { Routes } from "react-router-dom";
import { NavbarSection } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import Home from "./page/Home";
import Collection from "./page/Collection";
import Auctions from "./page/Auctions";
import NFTDetail from "./page/NFTDetail";
import Explore from "./page/Explore";
import Transaction from "./page/Transaction";
import UserCollectionPage from "./page/UserCollectionPage";
import EditProfilePage from "./page/EditProfilePage";

function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <NavbarSection />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<LoginPage />} />
                <Route path="/sign-up" element={<RegisterPage />} />

                <Route path="/explore" element={<Explore />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/nft/:id" element={<NFTDetail />} />
                <Route path="/transaction/:id" element={<Transaction />} />
                <Route path="/my-collection" element={<UserCollectionPage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
