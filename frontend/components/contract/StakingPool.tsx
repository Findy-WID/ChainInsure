"use client";
import React, { useState } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Coins, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const STAKING_POOL_ADDRESS =
  "0x787C1c5781Ee9aa2F4DACA98554953534DD333Fa" as const;
import stakingPoolABI from "../../contractData/StakingPool";
import { useSendTransaction } from "wagmi";

export default function StakingPool() {
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Account & Balance hooks
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  // Contract Read hooks
  const { data: totalStaked } = useReadContract({
    address: STAKING_POOL_ADDRESS,
    abi: stakingPoolABI,
    functionName: "totalStaked",
  });

  const { data: userStake } = useReadContract({
    address: STAKING_POOL_ADDRESS,
    abi: stakingPoolABI,
    functionName: "userStakes",
    args: [address] as any,
  });

  // Contract Write hooks
  const { writeContract: writeStake, data: stakeHash } = useWriteContract();
  const { writeContract: writeWithdraw, data: withdrawHash } =
    useWriteContract();
  const { writeContract: writeClaim, data: claimHash } = useWriteContract();

  // Transaction Receipt hooks
  const { isLoading: isStaking, isSuccess: stakeSuccess } =
    useWaitForTransactionReceipt({
      hash: stakeHash,
    });

  const { isLoading: isWithdrawing, isSuccess: withdrawSuccess } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    });

  const { isLoading: isClaiming, isSuccess: claimSuccess } =
    useWaitForTransactionReceipt({
      hash: claimHash,
    });

  const { data: hash, isPending, sendTransaction } = useSendTransaction();

  const handleStake = async () => {
    if (!stakeAmount) return;
    setError("");
    try {
      if (sendTransaction) {
        sendTransaction({
          to: STAKING_POOL_ADDRESS,
          value: parseEther(stakeAmount),
        });
        setStakeAmount("");
      }
    } catch (err: any) {
      setError(err.message || "Error staking tokens");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    setError("");

    try {
      await writeWithdraw({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        functionName: "withdraw",
        args: [parseEther(withdrawAmount)],
      });
      setWithdrawAmount("");
    } catch (err: any) {
      setError(err.message || "Error withdrawing tokens");
    }
  };

  const handleClaimRewards = async () => {
    setError("");
    try {
      await writeClaim({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        functionName: "claimRewards",
      });
    } catch (err: any) {
      setError(err.message || "Error claiming rewards");
    }
  };

  const isLoading = isStaking || isWithdrawing || isClaiming;
  const stakedAmount = userStake ? userStake[0] : BigInt(0); // amount is first element
  const rewardAmount = userStake ? userStake[1] : BigInt(0); // rewardDebt is second element

  const displayBalance = balance ? formatEther(balance.value) : "0";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Staking Pool</h1>
          <p className="text-gray-600">Stake your ETH and earn rewards</p>
        </div>

        {/* Wallet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDisconnected ? (
              <p className="text-red-500">Wallet not connected</p>
            ) : isConnecting ? (
              <p>Connecting...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm">Connected: {address}</p>
                <p className="text-sm">Balance: {displayBalance} ETH</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Staking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Stake</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {stakedAmount ? formatEther(stakedAmount) : "0"} ETH
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {rewardAmount ? formatEther(rewardAmount) : "0"} ETH
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Staked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalStaked ? formatEther(totalStaked) : "0"} ETH
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stake */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5" />
                Stake ETH
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Amount to stake"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                disabled={isLoading || isDisconnected}
              />
              <Button
                onClick={handleStake}
                disabled={isLoading || isDisconnected || !stakeAmount}
                className="w-full"
              >
                {isStaking ? "Staking..." : "Stake"}
              </Button>
              {/* <button 
        onClick={handleStake}
        disabled={isPending}
      >
        {isPending ? 'Staking...' : 'Stake'}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {error && <div>Error: {error}</div>} */}
            </CardContent>
          </Card>

          {/* Withdraw */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5" />
                Withdraw ETH
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Amount to withdraw"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isLoading || isDisconnected}
              />
              <Button
                onClick={handleWithdraw}
                disabled={isLoading || isDisconnected || !withdrawAmount}
                className="w-full"
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Claim Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleClaimRewards}
              disabled={
                isLoading ||
                isDisconnected ||
                !rewardAmount ||
                rewardAmount === BigInt(0)
              }
              className="w-full"
            >
              {isClaiming ? "Claiming..." : "Claim Rewards"}
            </Button>
          </CardContent>
        </Card>

        {/* Transaction Success Messages */}
        {(stakeSuccess || withdrawSuccess || claimSuccess) && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>
              {stakeSuccess && "Stake successful!"}
              {withdrawSuccess && "Withdrawal successful!"}
              {claimSuccess && "Rewards claimed successfully!"}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
