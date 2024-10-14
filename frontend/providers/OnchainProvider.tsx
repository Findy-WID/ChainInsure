"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";
import { wagmiConfig } from "@/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WalletProvider } from "@/components/wallet/WalletContext";

type Props = { children: ReactNode };

const projectId = process.env.NEXT_PUBLIC_CHAININSURE_PROJECT_ID;

const queryClient = new QueryClient();

export default function OnchainProvider({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <OnchainKitProvider apiKey={projectId} chain={base}>
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </OnchainKitProvider>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
