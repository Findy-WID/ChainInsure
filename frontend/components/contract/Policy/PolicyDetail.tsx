'use client'
import { useReadContract } from 'wagmi'
import InsuranceManagerABI from '../../../contractData/InsuranceManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const contractAddress = '0x6D0ceF6a337bF944bc4E002b91D445dE6E28aD08'

export function PolicyDetails({ address }: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({

        address: contractAddress,
        abi: InsuranceManagerABI,
        functionName: 'getPolicy',
        args: [address],
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching policy details</div>

  const policy = data?.[0] as { id: bigint; owner: `0x${string}`; coverageAmount: bigint; premium: bigint; period: bigint; startTime: bigint; active: boolean; status: number; }

  if (!policy) return <div className='text-2xl text-green-700'>No policy found</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className='bg-orange-700'>Your Policy</CardTitle>
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