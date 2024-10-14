import { http, createConfig } from 'wagmi';
import { base, sepolia, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
 
export const wagmiConfig = createConfig({
  chains: [base, sepolia],
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
    [baseSepolia.id]: http(),
  },
});