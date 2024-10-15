'use client'

import { useState, useEffect } from 'react'
import { useSimulateContract, useContractRead, useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner
import  stakingPoolABI  from '../../contractData/StakingPool'


const stakingPoolAddress = '0x9b87EfDFcB734243E483f447d73EccC128023839'

export function StakingPool() {
  const [stakeAmount, setStakeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { address } = useAccount()
  const { data: ethBalance } = useBalance({ address })

  const { data: totalStaked } = useReadContract({
    address: stakingPoolAddress,
    abi: stakingPoolABI,
    functionName: 'totalStaked',
  })

  const { data: stakedAmount, refetch: refetchStakedAmount } = useReadContract({
    address: stakingPoolAddress,
    abi: stakingPoolABI,
    functionName: 'totalStaked',
  })

  const { data: rewards, refetch: refetchRewards } = useReadContract({
    address: stakingPoolAddress,
    abi: stakingPoolABI,
    functionName: 'getRewards',
  })

  const { data: stakeConfig } = useWriteContract({
    address: stakingPoolAddress,
    abi: stakingPoolABI,
    functionName: 'stake',
    value: stakeAmount ? parseEther(stakeAmount) : undefined,
  })

  const { data: stake, isPending: isStaking } = useWriteContract({
    address: stakingPoolAddress,
    abi: stakingPoolABI,
    functionName: 'stake',
    value: stakeAmount ? parseEther(stakeAmount) : undefined,
  })
  const { data: withdrawData, isPending: isWithdrawingData } = useWriteContract({
    abi: stakingPoolABI,
    functionName: 'withdraw',
    args: [withdrawAmount ? parseEther(withdrawAmount) : BigInt(0)],
  })

  const { data: withdraw, isPending: isWithdrawing } = useWriteContract({
    address: stakingPoolAddress,
    abi: stakingPoolABI,
    functionName: 'withdraw',
    args: [withdrawAmount ? parseEther(withdrawAmount) : BigInt(0)],
  })

  const { data: claimRewards, isPending: isClaiming } = useWriteContract({
    address: stakingPoolAddress,
    abi: stakingPoolABI,
    functionName: 'claimRewards',
    functionName: 'claimRewards',
  })

  const { data: claimRewards, isPending: isClaiming } = useWriteContract(claimRewardsConfig)

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault()
    if (!stake) return
    stake()
  }

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    if (!withdraw) return
    withdraw()
  }

  const handleClaimRewards = () => {
    if (!claimRewards) return
    claimRewards()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refetchStakedAmount()
      refetchRewards()
    }, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [refetchStakedAmount, refetchRewards])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staking Pool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Total Staked: {totalStaked ? formatEther(totalStaked) : '0'} ETH</p>
        <p>Your Staked Amount: {stakedAmount ? formatEther(stakedAmount) : '0'} ETH</p>
        <p>Your Rewards: {rewards ? formatEther(rewards) : '0'} ETH</p>
        <p>Your ETH Balance: {ethBalance ? formatEther(ethBalance.value) : '0'} ETH</p>

        <form onSubmit={handleStake} className="space-y-2">
          <Label htmlFor="stakeAmount">Stake Amount (ETH)</Label>
          <Input
            id="stakeAmount"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            type="number"
            step="0.01"
            min="0"
            max={ethBalance ? formatEther(ethBalance.value) : '0'}
            required
          />
          <Button type="submit" disabled={isStaking}>
            {isStaking ? 'Staking...' : 'Stake'}
          </Button>
        </form>

        <form onSubmit={handleWithdraw} className="space-y-2">
          <Label htmlFor="withdrawAmount">Withdraw Amount (ETH)</Label>
          <Input
            id="withdrawAmount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            type="number"
            step="0.01"
            min="0"
            max={stakedAmount ? formatEther(stakedAmount) : '0'}
            required
          />
          <Button type="submit" disabled={isWithdrawing}>
            {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
          </Button>
        </form>

        <Button onClick={handleClaimRewards} disabled={isClaiming || !rewards || rewards === BigInt(0)}>
          {isClaiming ? 'Claiming...' : 'Claim Rewards'}
        </Button>
      </CardContent>
    </Card>
  )
}