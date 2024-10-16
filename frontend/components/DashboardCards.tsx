import { DashboardCardItem } from "./DashboardCardItem"
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import stakingPoolABI from '../contractData/StakingPool'
import managerABI from '../contractData/Manager';


const STAKING_POOL_ADDRESS = '0x9b87EfDFcB734243E483f447d73EccC128023839' as const
const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D';

type UserStake = {
    amount: bigint;
    rewardDebt: bigint;
    lastStakeTime: bigint;
}

export function DashboardCards () {
    const { address } = useAccount()
    

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

    const { data: vaultBalance } = useReadContract({
        address: MANAGER_CONTRACT_ADDRESS,
        abi: managerABI,
        functionName: 'getVaultBalance',
        args: [address] as any,
      });

    const stakedAmount = userStake?.amount ?? BigInt(0)

    return (
        <article className="grid grid-cols-3 p-6 gap-6">
            <DashboardCardItem title="Total Amount Staked" value={`${formatEther(stakedAmount)} ETH`} total={totalStaked ? `${formatEther(totalStaked)} ETH` : '0 ETH'} />
            <DashboardCardItem title="My Vault Balance" value={vaultBalance ? `${formatEther(vaultBalance)} ETH` : '0 ETH'} total={`${50149} ETH`} />
            <DashboardCardItem title="Total Withdrawable" value={17} total={6285} />
        </article>
        
    )
}