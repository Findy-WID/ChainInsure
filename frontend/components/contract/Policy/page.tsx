'use client'

import { useAccount, useReadContract } from 'wagmi'
import { CreatePolicy } from './CreatePolicy'
import { ClaimPolicy } from './ClaimPolicy'
import { CancelPolicy } from './CancelPolicy'
import managerABI from '../../../contractData/Manager';
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
    return <div>Please connect your wallet</div>
  }

  return (
    <div>
      <CreatePolicy />
      <PolicyDetails address={address} />
      <div className="flex flex-col gap-4 my-8">

      {vaultAddress && <ClaimPolicy vaultAddress={vaultAddress as `0x${string}`} />}
      <CancelPolicy />
      </div>
    </div>
  )
}