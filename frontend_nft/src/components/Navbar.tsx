"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export const NavbarSection = () => {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Explore", link: "/explore" },
    { name: "Collection", link: "/collection" },
    { name: "Auctions", link: "/auctions" },
  ];

  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hovered, setHovered] = useState(-1);

  useEffect(() => {
    const currentIdx = navItems.findIndex(
      (item) => item.link === location.pathname
    );
    if (currentIdx !== -1) {
      setActiveIdx(currentIdx);
    }
  }, [location.pathname]);

  const onItemClick = (idx: number) => {
    setActiveIdx(idx);
  };

  return (
    <div className="w-full top-5 z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems}
            className=""
            onItemClick={(idx: number) => setActiveIdx(idx)}
            activeIdx={activeIdx}
          />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <NavbarButton variant="secondary" className="text-primary">
                Login
              </NavbarButton>
            </Link>
            <Link to="/connect-wallet">
              <NavbarButton variant="primary" className="bg-primary text-white rounded-full">
                Connect Wallet
              </NavbarButton>
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`link-${idx}`}
                to={item.link}
                onMouseEnter={() => setHovered(idx)}
                onClick={() => {
                  onItemClick(idx);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "relative px-4 py-2",
                  activeIdx === idx
                    ? "text-white"
                    : "text-neutral-600 dark:text-neutral-300"
                )}
              >
                {hovered === idx && (
                  <motion.div
                    layoutId="hovered"
                    className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800 -z-10"
                  />
                )}
                <span className="relative z-20">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              <Link
                to="/login"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <NavbarButton variant="primary" className="w-full">
                  Login
                </NavbarButton>
              </Link>
              <Link
                to="/connect-wallet"
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <NavbarButton variant="primary" className="w-full">
                  Connect Wallet
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};
