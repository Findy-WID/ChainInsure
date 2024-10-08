"use client"

import { useConnectWallet } from '@coinbase/onchainkit';
import { Button } from "@/components/ui/button"

interface ConnectButtonProps {
  onConnect: (connected: boolean) => void;
}

export function ConnectButton({ onConnect }: ConnectButtonProps) {
  const { isConnected, connect } = useConnectWallet();

  const handleClick = async () => {
    if (!isConnected) {
      try {
        await connect();
        onConnect(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  return (
    <Button onClick={handleClick}>
      {isConnected ? 'Connected' : 'Connect Wallet'}
    </Button>
  );
}