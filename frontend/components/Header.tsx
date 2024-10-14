
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useRouter } from "next/navigation";
import LoginButton from "./login_button/LoginButton";

export function Header() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <header className={`fixed z-50 bg-[#15173033] w-full transition-all duration-300 ${isScrolled ? 'bg-white/80  border-b border-[#1E1E33] backdrop-blur-md shadow-md text-[#1E1E33]' : 'text-white'}`}>
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <nav className="hidden md:flex space-x-8">
        <Link href="#docs" className=" hover:text-blue-600">
          Docs
        </Link>
        <Link href="#about-us" className=" hover:text-blue-600">
          About us
        </Link>
        <Link href="#blog" className=" hover:text-blue-600">
          Blog
        </Link>
        <Link href="#support" className=" hover:text-blue-600">
          Support
        </Link>
      </nav>
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-2xl font-light leading-10  font-serif">
          Chain Insure
        </span>
      </Link>

      <div className="flex items-center space-x-4">
      <div className="flex justify-between bg-[#1E1E33] rounded-md">
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </div>
      {/* <LoginButton /> */}

      </div>


    </div>
  </header>
  );
}
