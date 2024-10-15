'use client'

import { useContractReads } from 'wagmi'
import { insuranceManagerABI } from '@/lib/contractABI'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const contractAddress = '0x...' // Replace with your contract address

export function PolicyDetails({ address }: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: contractAddress,
        abi: insuranceManagerABI,
        functionName: 'getPolicy',
        args: [address],
      },
    ],
    watch: true, // Optional: use 'watch' for real-time updates
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching policy details</div>

  const policy = data?.[0]

  if (!policy) return <div>No policy found</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Coverage Amount: {policy.coverageAmount?.toString()} ETH</p>
        <p>Premium: {policy.premium?.toString()} ETH</p>
        <p>Period: {policy.period?.toString()} days</p>
        <p>Status: {['Pending', 'Approved', 'Rejected', 'Claimed'][policy.status]}</p>
        <p>Active: {policy.active ? 'Yes' : 'No'}</p>
      </CardContent>
    </Card>
  )
}



// staking contract