'use client'

import { useAccount, useReadContract } from 'wagmi'
import { CreatePolicy } from './CreatePolicy'
import { ClaimPolicy } from './ClaimPolicy'
import { CancelPolicy } from './CancelPolicy'
import managerABI from '@/contractData/Manager'
import { Card } from '@/components/ui/card'
import { PolicyDetails } from './PolicyDetail'

const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D'

export function InsuranceManager() {
  const { address } = useAccount()

  const { data: vaultAddress } = useReadContract({
    address: MANAGER_CONTRACT_ADDRESS,
    abi: managerABI,
    functionName: 'getVaultAddress',
    args: [address] as any,
  })

  if (!address) {
    return <div className="text-center p-4">Please connect your wallet</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <CreatePolicy />
      
      <div className="my-8">
        <PolicyDetails address={address} />
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {vaultAddress && (
            <ClaimPolicy vaultAddress={vaultAddress as `0x${string}`} />
          )}
          <CancelPolicy address={address} />
        </div>
      </Card>
    </div>
  )
}