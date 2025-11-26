// import { Routes } from "react-router-dom";
import { NavbarSection } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import Home from "./page/Home";
import Collection from "./page/Collection";
import Auctions from "./page/Auctions";
import NFTDetail from "./page/NFTDetail";
import Explore from "./page/Explore";
import Transaction from "./page/Transaction";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <NavbarSection />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/nft/:id" element={<NFTDetail />} />
        <Route path="/transaction/:id" element={<Transaction />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
