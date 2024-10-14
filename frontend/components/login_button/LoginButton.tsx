'use client';

import { useConnect } from 'wagmi';
import { Button } from '@/components/ui/button'; // Shadcn UI button
import WalletWrapper from '../wallet/WalletWrapper';
import { useState } from 'react';

const LoginButton = () => {
    const { connect, connectors, error, isPending } = useConnect(); 
    const [isConnecting, setIsConnecting] = useState(false);
  
    const handleConnect = async () => {
        try {
          setIsConnecting(true);
          // Ensure you are passing the correct object structure
          await connect({ connector: connectors[0] }); // Assuming Coinbase is the only wallet
        } catch (err) {
          console.error('Error connecting:', err);
        } finally {
          setIsConnecting(false);
        }
      };

    return (
        <div data-testid="ockConnectWallet_Container" className="space-y-4">
            {/* Shadcn UI Button for wallet connection */}
            <Button onClick={handleConnect} disabled={isConnecting || isPending}>
                {isConnecting || isPending ? 'Connecting...' : 'Connect Wallet'}
            </Button>

            {error && <div className="text-red-500">{error.message}</div>}

            {/* Additional Wallet Wrapper */}
            <WalletWrapper
                className="min-w-[90px]"
                text="Log in"
                withWalletAggregator={true}
            />
        </div>
    );
};

export default LoginButton;
