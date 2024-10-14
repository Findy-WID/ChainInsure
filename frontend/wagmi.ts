import { http, createConfig } from 'wagmi';
import { base, sepolia, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
 
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [
    coinbaseWallet({
      appName: 'chaininsure',
      preference: 'smartWalletOnly', 
      version: '4',
    }),
  ],
  // ssr: true,
  transports: {
<<<<<<< HEAD
=======
    // [base.id]: http(),
    
>>>>>>> ed8524b131a9eba5edcb433ed728350879192a6b
    [baseSepolia.id]: http(),
  },
});