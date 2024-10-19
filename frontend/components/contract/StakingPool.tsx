// "use client";
// import React, { useState } from "react";
// import {
//   useAccount,
//   useBalance,
//   useReadContract,
//   useWriteContract,
//   useWaitForTransactionReceipt,
// } from "wagmi";
// import { parseEther, formatEther } from "viem";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Wallet, Coins, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

// const STAKING_POOL_ADDRESS =
//   "0x787C1c5781Ee9aa2F4DACA98554953534DD333Fa" as const;
// import stakingPoolABI from "../../contractData/StakingPool";
// import { useSendTransaction } from "wagmi";

// export default function StakingPool() {
//   const [stakeAmount, setStakeAmount] = useState<string>("");
//   const [withdrawAmount, setWithdrawAmount] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   // Account & Balance hooks
//   const { address, isConnecting, isDisconnected } = useAccount();
//   const { data: balance } = useBalance({
//     address: address,
//   });

//   // Contract Read hooks
//   const { data: totalStaked } = useReadContract({
//     address: STAKING_POOL_ADDRESS,
//     abi: stakingPoolABI,
//     functionName: "totalStaked",
//   });

//   const { data: userStake } = useReadContract({
//     address: STAKING_POOL_ADDRESS,
//     abi: stakingPoolABI,
//     functionName: "userStakes",
//     args: [address] as any,
//   });

//   // Contract Write hooks
//   const { writeContract: writeStake, data: stakeHash } = useWriteContract();
//   const { writeContract: writeWithdraw, data: withdrawHash } =
//     useWriteContract();
//   const { writeContract: writeClaim, data: claimHash } = useWriteContract();

//   // Transaction Receipt hooks
//   const { isLoading: isStaking, isSuccess: stakeSuccess } =
//     useWaitForTransactionReceipt({
//       hash: stakeHash,
//     });

//   const { isLoading: isWithdrawing, isSuccess: withdrawSuccess } =
//     useWaitForTransactionReceipt({
//       hash: withdrawHash,
//     });

//   const { isLoading: isClaiming, isSuccess: claimSuccess } =
//     useWaitForTransactionReceipt({
//       hash: claimHash,
//     });

//   const { data: hash, isPending, sendTransaction } = useSendTransaction();

//   const handleStake = async () => {
//     if (!stakeAmount) return;
//     setError("");
//     try {
//       if (sendTransaction) {
//         sendTransaction({
//           to: STAKING_POOL_ADDRESS,
//           value: parseEther(stakeAmount),
//         });
//         setStakeAmount("");
//       }
//     } catch (err: any) {
//       setError(err.message || "Error staking tokens");
//     }
//   };

//   const handleWithdraw = async () => {
//     if (!withdrawAmount) return;
//     setError("");

//     try {
//       await writeWithdraw({
//         address: STAKING_POOL_ADDRESS,
//         abi: stakingPoolABI,
//         functionName: "withdraw",
//         args: [parseEther(withdrawAmount)],
//       });
//       setWithdrawAmount("");
//     } catch (err: any) {
//       setError(err.message || "Error withdrawing tokens");
//     }
//   };

//   const handleClaimRewards = async () => {
//     setError("");
//     try {
//       await writeClaim({
//         address: STAKING_POOL_ADDRESS,
//         abi: stakingPoolABI,
//         functionName: "claimRewards",
//       });
//     } catch (err: any) {
//       setError(err.message || "Error claiming rewards");
//     }
//   };

//   const isLoading = isStaking || isWithdrawing || isClaiming;
//   const stakedAmount = userStake ? userStake[0] : BigInt(0); // amount is first element
//   const rewardAmount = userStake ? userStake[1] : BigInt(0); // rewardDebt is second element

//   const displayBalance = balance ? formatEther(balance.value) : "0";

//   return (
//     <div className="min-h-screen w-[80%] bg-gray-100 p-8">
//       <div className="w-2xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-2">Staking Pool</h1>
//           <p className="text-gray-600">Stake your ETH and earn rewards</p>
//         </div>

//         {/* Wallet Status */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Wallet className="h-5 w-5" />
//               Wallet Status
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {isDisconnected ? (
//               <p className="text-red-500">Wallet not connected</p>
//             ) : isConnecting ? (
//               <p>Connecting...</p>
//             ) : (
//               <div className="space-y-2">
//                 <p className="text-sm truncate">Connected: {address}</p>
//                 <p className="text-sm">Balance: {displayBalance} ETH</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Staking Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Your Stake</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">
//                 {stakedAmount ? formatEther(stakedAmount) : "0"} ETH
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Your Rewards</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">
//                 {rewardAmount ? formatEther(rewardAmount) : "0"} ETH
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Total Staked</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">
//                 {totalStaked ? formatEther(totalStaked) : "0"} ETH
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Stake */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <ArrowDownCircle className="h-5 w-5" />
//                 Stake ETH
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Input
//                 type="number"
//                 placeholder="Amount to stake"
//                 value={stakeAmount}
//                 onChange={(e) => setStakeAmount(e.target.value)}
//                 disabled={isLoading || isDisconnected}
//               />
//               <Button
//                 onClick={handleStake}
//                 disabled={isLoading || isDisconnected || !stakeAmount}
//                 className="w-full"
//               >
//                 {isStaking ? "Staking..." : "Stake"}
//               </Button>
//               {/* <button
//         onClick={handleStake}
//         disabled={isPending}
//       >
//         {isPending ? 'Staking...' : 'Stake'}
//       </button>
//       {hash && <div>Transaction Hash: {hash}</div>}
//       {error && <div>Error: {error}</div>} */}
//             </CardContent>
//           </Card>

//           {/* Withdraw */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <ArrowUpCircle className="h-5 w-5" />
//                 Withdraw ETH
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Input
//                 type="number"
//                 placeholder="Amount to withdraw"
//                 value={withdrawAmount}
//                 onChange={(e) => setWithdrawAmount(e.target.value)}
//                 disabled={isLoading || isDisconnected}
//               />
//               <Button
//                 onClick={handleWithdraw}
//                 disabled={isLoading || isDisconnected || !withdrawAmount}
//                 className="w-full"
//               >
//                 {isWithdrawing ? "Withdrawing..." : "Withdraw"}
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Claim Rewards */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Coins className="h-5 w-5" />
//               Rewards
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Button
//               onClick={handleClaimRewards}
//               disabled={
//                 isLoading ||
//                 isDisconnected ||
//                 !rewardAmount ||
//                 rewardAmount === BigInt(0)
//               }
//               className="w-full"
//             >
//               {isClaiming ? "Claiming..." : "Claim Rewards"}
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Transaction Success Messages */}
//         {(stakeSuccess || withdrawSuccess || claimSuccess) && (
//           <Alert className="bg-green-50 border-green-200">
//             <AlertDescription>
//               {stakeSuccess && "Stake successful!"}
//               {withdrawSuccess && "Withdrawal successful!"}
//               {claimSuccess && "Rewards claimed successfully!"}
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Error Display */}
//         {error && (
//           <Alert variant="destructive">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
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
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Wallet,
  Coins,
  ArrowDownCircle,
  ArrowUpCircle,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STAKING_POOL_ADDRESS =
  "0x787C1c5781Ee9aa2F4DACA98554953534DD333Fa" as const;
import stakingPoolABI from "../../contractData/StakingPool";

export default function StakingPool() {
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"stake" | "withdraw">("stake");

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
    args: [address!],
    // enabled: !!address,
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

  const handleStake = async () => {
    if (!stakeAmount || !address) return;
    setError("");

    try {
      await writeStake({
        address: STAKING_POOL_ADDRESS,
        abi: stakingPoolABI,
        functionName: "receive",
        args: [parseEther(stakeAmount)],
      });
      setStakeAmount("");
    } catch (err: any) {
      setError(err.message || "Error staking tokens");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !address) return;
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
    if (!address) return;
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

  useEffect(() => {
    if (stakeSuccess || withdrawSuccess || claimSuccess) {
      setError("");
    }
  }, [stakeSuccess, withdrawSuccess, claimSuccess]);


  const isLoading = isStaking || isWithdrawing || isClaiming;
  const stakedAmount = userStake ? userStake[0] : BigInt(0);
  const rewardAmount = userStake ? userStake[1] : BigInt(0);
  const displayBalance = balance ? formatEther(balance.value) : "0";



  return (
    <div className="min-h-screen  bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            ETH Staking Pool
          </h1>
          <p className="text-gray-400 text-lg">
            Stake your ETH and earn rewards
          </p>
        </div>

        {/* Connection Status Banner */}
        {isDisconnected && (
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/50 text-yellow-500">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Not Connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to start staking
            </AlertDescription>
          </Alert>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wallet Card */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Wallet className="h-5 w-5 text-blue-400" />
                Wallet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isDisconnected ? (
                <p className="text-yellow-500">Not Connected</p>
              ) : isConnecting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-white">Address:</span>
                    <br />
                    <span className="break-all">{address}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-white">Balance:</span>
                    <br />
                    <span className="text-xl font-bold text-blue-400">
                      {parseFloat(displayBalance).toFixed(4)} ETH
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Coins className="h-5 w-5 text-purple-400" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Staked Amount</p>
                <p className="text-2xl font-bold text-purple-400">
                  {parseFloat(formatEther(stakedAmount)).toFixed(4)} ETH
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Available Rewards</p>
                <p className="text-2xl font-bold text-green-400">
                  {parseFloat(formatEther(rewardAmount)).toFixed(4)} ETH
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleClaimRewards}
                disabled={
                  isLoading ||
                  isDisconnected ||
                  !rewardAmount ||
                  rewardAmount === BigInt(0)
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {isClaiming ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Coins className="h-4 w-4 mr-2" />
                )}
                {isClaiming ? "Claiming..." : "Claim Rewards"}
              </Button>
            </CardFooter>
          </Card>

          {/* Pool Stats */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Info className="h-5 w-5 text-blue-400" />
                Pool Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Value Locked</p>
                <p className="text-2xl font-bold text-blue-400">
                  {totalStaked
                    ? parseFloat(formatEther(totalStaked)).toFixed(2)
                    : "0"}{" "}
                  ETH
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Annual Percentage Rate</p>
                <p className="text-2xl font-bold text-green-400">1.00%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <Card className="mt-6 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex justify-center space-x-2">
              <Button
                variant={activeTab === "stake" ? "default" : "outline"}
                onClick={() => setActiveTab("stake")}
                className={`flex-1 max-w-[200px] ${
                  activeTab === "stake" ? "bg-blue-500 hover:bg-blue-600" : ""
                }`}
              >
                <ArrowDownCircle className="h-4 w-4 mr-2" />
                Stake
              </Button>
              <Button
                variant={activeTab === "withdraw" ? "default" : "outline"}
                onClick={() => setActiveTab("withdraw")}
                className={`flex-1 max-w-[200px] ${
                  activeTab === "withdraw"
                    ? "bg-purple-500 hover:bg-purple-600"
                    : ""
                }`}
              >
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto space-y-4">
              {activeTab === "stake" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Amount to Stake
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        disabled={isLoading || isDisconnected}
                        className="pr-16 bg-gray-900/50 text-white"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 text-white -translate-y-1/2 h-6 text-xs"
                        onClick={() =>
                          balance && setStakeAmount(formatEther(balance.value))
                        }
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleStake}
                    disabled={isLoading || isDisconnected || !stakeAmount}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {isStaking ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 mr-2" />
                    )}
                    {isStaking ? "Staking..." : "Stake ETH"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Amount to Withdraw
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        disabled={isLoading || isDisconnected}
                        className="pr-16 bg-gray-900/50"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 text-xs"
                        onClick={() =>
                          stakedAmount &&
                          setWithdrawAmount(formatEther(stakedAmount))
                        }
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    disabled={isLoading || isDisconnected || !withdrawAmount}
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    {isWithdrawing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ArrowUpCircle className="h-4 w-4 mr-2" />
                    )}
                    {isWithdrawing ? "Withdrawing..." : "Withdraw ETH"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Success Messages */}
        <div className="mt-4">
          {stakeSuccess && "Your ETH has been successfully staked!"}
          {withdrawSuccess && "Your ETH has been successfully withdrawn!"}
          {claimSuccess && "Your rewards have been successfully claimed!"}
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="mt-4 bg-red-500/10 border-red-500/50 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
