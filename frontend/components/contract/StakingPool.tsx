'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import stakingPoolABI from '../../contractData/StakingPool'

const STAKING_POOL_ADDRESS = '0x9b87EfDFcB734243E483f447d73EccC128023839' as const

// Type for the userStakes return value
type UserStake = {
  amount: bigint;
  rewardDebt: bigint;
  lastStakeTime: bigint;
}

export function StakingPool() {
  const [stakeAmount, setStakeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  
  const { address } = useAccount()
  const { data: ethBalance } = useBalance({ 
    address: address as `0x${string}` 
  })

  const { data: totalStaked } = useReadContract({
    address: STAKING_POOL_ADDRESS,
    abi: stakingPoolABI,
    functionName: 'totalStaked'
  })

  const { data: userStake } = useReadContract({
    address: STAKING_POOL_ADDRESS,
    abi: stakingPoolABI,
    functionName: 'userStakes',
    args: address ? [address] : undefined
  }) as { data: UserStake }

  const { writeContract: withdraw, isPending: isWithdrawing } = useWriteContract()
  const { writeContract: claimRewards, isPending: isClaiming } = useWriteContract()

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stakeAmount || !address || !withdraw) return
    
    try {
      await withdraw({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        value: parseEther(stakeAmount)
      })
      toast.success('Staking transaction sent')
    } catch (error) {
      toast.error('Staking failed')
      console.error(error)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!withdrawAmount || !withdraw) return

    try {
      await withdraw({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        functionName: 'withdraw',
        args: [parseEther(withdrawAmount)]
      })
      toast.success('Withdrawal request sent')
    } catch (error) {
      toast.error('Withdrawal failed')
      console.error(error)
    }
  }

  const handleClaimRewards = async () => {
    if (!claimRewards || !address) return

    try {
      await claimRewards({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        functionName: 'claimRewards'
      })
      toast.success('Claim request sent')
    } catch (error) {
      toast.error('Claim failed')
      console.error(error)
    }
  }

  // Safely get values from userStake
  const stakedAmount = userStake?.amount ?? BigInt(0)
  const rewards = userStake?.rewardDebt ?? BigInt(0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staking Pool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Total Staked: {totalStaked ? formatEther(totalStaked) : '0'} ETH</p>
        <p>Your Staked Amount: {formatEther(stakedAmount)} ETH</p>
        <p>Your Rewards: {formatEther(rewards)} ETH</p>
        <p>Your ETH Balance: {ethBalance ? formatEther(ethBalance.value) : '0'} ETH</p>

        <form onSubmit={handleStake} className="space-y-2">
          <Label htmlFor="stakeAmount">Stake Amount (ETH)</Label>
          <Input
            id="stakeAmount"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            type="number"
            step="0.000001"
            min="0"
            max={ethBalance ? formatEther(ethBalance.value) : '0'}
            required
          />
          <Button type="submit">
            Stake ETH
          </Button>
        </form>

        <form onSubmit={handleWithdraw} className="space-y-2">
          <Label htmlFor="withdrawAmount">Withdraw Amount (ETH)</Label>
          <Input
            id="withdrawAmount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            type="number"
            step="0.000000001"
            min="0"
            max={formatEther(stakedAmount)}
            required
          />
          <Button type="submit" disabled={isWithdrawing}>
            {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
          </Button>
        </form>

        <Button 
          onClick={handleClaimRewards} 
          disabled={isClaiming || rewards === BigInt(0)}
        >
          {isClaiming ? 'Claiming...' : 'Claim Rewards'}
        </Button>
      </CardContent>
    </Card>
  )
}