
'use client'

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import stakingPoolABI from '../../contractData/StakingPool';

const STAKING_POOL_ADDRESS = '0x787C1c5781Ee9aa2F4DACA98554953534DD333Fa' as const;

type UserStake = {
  amount: bigint;
  rewardDebt: bigint;
  lastStakeTime: bigint;
};

export function StakingPool() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ 
    address: address as `0x${string}` 
  });

  const { data: totalStaked } = useReadContract({
    address: STAKING_POOL_ADDRESS,
    abi: stakingPoolABI,
    functionName: 'totalStaked'
  }) as { data: bigint | undefined };

  const { data: userStake, refetch: refetchUserStake } = useReadContract({
    address: STAKING_POOL_ADDRESS,
    abi: stakingPoolABI,
    functionName: 'userStakes',
    args: address ? [address] : undefined
  }) as { data: UserStake | undefined, refetch: () => void };

  const { data: rewards, refetch: refetchRewards } = useReadContract({
    address: STAKING_POOL_ADDRESS,
    abi: stakingPoolABI,
    functionName: 'rewardRate',
    args: [address] as any,
  }) as { data: bigint | undefined, refetch: () => void };

  const { writeContract: stake, data: stakeData } = useWriteContract();
  const { writeContract: withdraw, data: withdrawData } = useWriteContract();
  const { writeContract: claimRewards, data: claimData } = useWriteContract();

  const { isLoading: isStaking } = useWaitForTransactionReceipt({ hash: stakeData?.hash as any });
  const { isLoading: isWithdrawing } = useWaitForTransactionReceipt({ hash: withdrawData?.hash as any });
  const { isLoading: isClaiming } = useWaitForTransactionReceipt({ hash: claimData?.hash as any });

  useEffect(() => {
    if (!isStaking && !isWithdrawing && !isClaiming) {
      refetchUserStake();
      refetchRewards();
    }
  }, [isStaking, isWithdrawing, isClaiming]);

  const handleStake = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!stakeAmount || !address) {
      toast.error("Please enter a stake amount and connect your wallet.");
      return;
    }
  
    try {
      const valueToStake = parseEther(stakeAmount);
  
      await stake({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        functionName: 'setRewardRate',
        args: [valueToStake]
      });
  
      toast.success("Staking transaction sent");
      setStakeAmount('');
    } catch (error) {
      toast.error("Staking failed");
      console.error("Staking error:", error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !withdraw) return;

    try {
      const withdrawValue = parseEther(withdrawAmount);
      await withdraw({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        functionName: 'withdraw',
        args: [withdrawValue]
      });
      toast.success('Withdrawal request sent');
      setWithdrawAmount('');
    } catch (error) {
      toast.error('Withdrawal failed');
      console.error(error);
    }
  };

  const handleClaimRewards = async () => {
    if (!claimRewards || !address) return;

    try {
      await claimRewards({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        functionName: 'claimRewards'
      });
      toast.success('Claim request sent');
    } catch (error) {
      toast.error('Claim failed');
      console.error(error);
    }
  };

  const stakedAmount = userStake?.amount ?? BigInt(0);
  const rewardsAmount = rewards ?? BigInt(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staking Pool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Total Staked: {totalStaked ? formatEther(totalStaked) : '0'} ETH</p>
        <p>Your Staked Amount: {formatEther(stakedAmount)} ETH</p>
        <p>Your Rewards: {formatEther(rewardsAmount)} ETH</p>
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
          <Button type="submit" disabled={isStaking}>
            {isStaking ? 'Staking...' : 'Stake ETH'}
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
          <Button type="submit" disabled={isWithdrawing || stakedAmount === BigInt(0)}>
            {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
          </Button>
        </form>

        <Button 
          onClick={handleClaimRewards} 
          disabled={isClaiming || rewardsAmount === BigInt(0)}
        >
          {isClaiming ? 'Claiming...' : `Claim Rewards (${formatEther(rewardsAmount)} ETH)`}
        </Button>
      </CardContent>
    </Card>
  );
}