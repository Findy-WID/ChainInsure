// "use client"

// import { useConnectWallet } from '@coinbase/onchainkit';
// import { Button } from "@/components/ui/button"

// interface ConnectButtonProps {
//   onConnect: (connected: boolean) => void;
// }

// export function ConnectButton({ onConnect }: ConnectButtonProps) {
//   const { isConnected, connect } = useConnectWallet();

//   const handleClick = async () => {
//     if (!isConnected) {
//       try {
//         await connect();
//         onConnect(true);
//       } catch (error) {
//         console.error('Failed to connect wallet:', error);
//       }
//     }
//   };

//   return (
//     <Button onClick={handleClick}>
//       {isConnected ? 'Connected' : 'Connect Wallet'}
//     </Button>
//   );
// }



"use client";

import React from 'react'
import {
    Avatar,

    Name,
  } from "@coinbase/onchainkit/identity";
  import {
    Wallet,
    ConnectWallet,

  } from "@coinbase/onchainkit/wallet";

export default function LoginButton() {
  return (
    <div className="flex justify-between bg-[#1E1E33] rounded-md">
    <Wallet>
      <ConnectWallet>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
    </Wallet>
  </div>
  )
}
