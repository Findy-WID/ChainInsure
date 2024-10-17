// import { http, createConfig } from 'wagmi';
// import { base, sepolia, baseSepolia } from 'wagmi/chains';
// import { coinbaseWallet } from 'wagmi/connectors';
 
// export const wagmiConfig = createConfig({
//   chains: [baseSepolia],
//   multiInjectedProviderDiscovery: false,
//   connectors: [
//     coinbaseWallet({
//       appName: 'chaininsure',
//       preference: 'smartWalletOnly', 
//       version: '4',
//     }),
//   ],
//   // ssr: true,
//   transports: {
//     [baseSepolia.id]: http(),
//   },
// });



import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, sepolia, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

export function getConfig() {
  return createConfig({
    chains: [baseSepolia], // You can add base and sepolia if needed: [base, sepolia, baseSepolia]
    multiInjectedProviderDiscovery: false,
    connectors: [
      injected(),
      coinbaseWallet({
        appName: 'chaininsure',
        preference: 'smartWalletOnly',
        version: '4',
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
      // Uncomment these if you add base and sepolia chains
      // [base.id]: http(),
      // [sepolia.id]: http(),
    },
  });
}

// Type declaration for Wagmi
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}

// Export the configuration
export const wagmiConfig = getConfig();