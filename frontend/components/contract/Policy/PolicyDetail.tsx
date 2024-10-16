'use client'

import { useReadContract } from 'wagmi'
import InsuranceManagerABI from '../../../contractData/InsuranceManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatEther } from 'viem'

const contractAddress = '0x51045De164CEB24f866fb788650748aEC8370769'

interface PolicyData {
  id: bigint;
  owner: `0x${string}`;
  coverageAmount: bigint;
  premium: bigint;
  period: bigint;
  startTime: bigint;
  active: boolean;
  status: number;
}

export function PolicyDetails({ address }: { address: `0x${string}` }) {
  const { data, isError, isPending } = useReadContract({
    address: contractAddress,
    abi: InsuranceManagerABI,
    functionName: 'getPolicy',
    args: [address],
  }) as { data: PolicyData | undefined, isError: boolean, isPending: boolean }

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error fetching policy details</div>

  if (!data) return <div className='text-2xl text-green-700'>No policy found</div>

  const statusMap = ['Pending', 'Approved', 'Rejected', 'Claimed']

  return (
    <Card>
      <CardHeader>
        <CardTitle className='bg-orange-700'>Your Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Coverage Amount: {formatEther(data.coverageAmount)} ETH</p>
        <p>Premium: {formatEther(data.premium)} ETH</p>
        <p>Period: {data.period.toString()} days</p>
        <p>Status: {statusMap[data.status] || 'Unknown'}</p>
        <p>Active: {data.active ? 'Yes' : 'No'}</p>
      </CardContent>
    </Card>
  )
}

// staking contract