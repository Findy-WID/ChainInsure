'use client'

import { useAccount } from 'wagmi'
import { WalletConnect } from '../WalletConnect'
import { CreatePolicy } from './CreatePolicy'
import { PolicyDetails } from './PolicyDetail'
import { ClaimPolicy } from './ClaimPolicy'
import { SecuredVault } from '../SecuredVault'
import { CancelPolicy } from './CancelPolicy'


export default function Home() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Welcome to Insurance DApp</h1>
        <p className="mb-4">Please connect your wallet to continue.</p>
        <WalletConnect />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Insurance DApp</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create New Policy</h2>
          <CreatePolicy />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Policy</h2>
          <PolicyDetails address={address!} />
          <div className="mt-4 space-x-4">
            <ClaimPolicy />
            <CancelPolicy />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Secured Vault</h2>
          {/* <SecuredVault userAddress={address!} /> */}
        </div>
      </div>
    </div>
  )
}