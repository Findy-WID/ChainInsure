// 'use client';

// import { useWriteContract } from 'wagmi'
// import { Button } from '@/components/ui/button'
// import insuranceManagerABI from '@/contractData/InsuranceManager';
// import { toast } from 'sonner'

// const contractAddress = '0x51045De164CEB24f866fb788650748aEC8370769';

// export function CancelPolicy() {
//   const { writeContract, isPending, isSuccess, isError } = useWriteContract()

//   const handleCancelPolicy = async () => {
//     try {
//       await writeContract({
//         address: contractAddress,
//         abi: insuranceManagerABI,
//         functionName: 'cancelPolicy',
//       })
//       toast.success('Policy cancellation request sent.')
//     } catch (error) {
//       console.error('Error cancelling policy:', error)
//       toast.error('Failed to cancel policy.')
//     }
//   }

//   // Provide feedback on success or error after writing the contract
//   if (isSuccess) {
//     toast.success('Policy cancelled successfully!')
//   }
//   if (isError) {
//     toast.error('Error cancelling policy.')
//   }

//   return (
//     <Button 
//       onClick={handleCancelPolicy} 
//       variant="destructive" 
//       disabled={isPending}
//     >
//       {isPending ? 'Cancelling...' : 'Cancel Policy'}
//     </Button>
//   )
// }



// 'use client'

// import { useState } from 'react'
// import { useWriteContract, useReadContract } from 'wagmi'
// import { Button } from '@/components/ui/button'
// import insuranceManagerABI from '@/contractData/InsuranceManager'
// import { toast } from 'sonner'

// const contractAddress = '0x51045De164CEB24f866fb788650748aEC8370769'

// interface CancelPolicyProps {
//   address: `0x${string}`
// }

// export function CancelPolicy({ address }: CancelPolicyProps) {
//   const [isLoading, setIsLoading] = useState(false)
  
//   // Read current policy
//   const { data: policy, refetch } = useReadContract({
//     address: contractAddress,
//     abi: insuranceManagerABI,
//     functionName: 'getPolicy',
//     args: [address],
//     // watch: true,
//   })

//   const { writeContractAsync } = useWriteContract()

//   const handleCancelPolicy = async () => {
//     if (!policy?.active) {
//       toast.error('No active policy found')
//       return
//     }

//     try {
//       setIsLoading(true)
//       toast.loading('Cancelling policy...')

//       const tx = await writeContractAsync({
//         address: contractAddress,
//         abi: insuranceManagerABI,
//         functionName: 'cancelPolicy',
//       })

//       // Wait for the transaction
//       toast.success('Cancelling policy... Please wait for confirmation')
      
//       // Refetch policy details after cancellation
//       await refetch()
      
//       toast.success('Policy cancelled successfully!')
//     } catch (error: any) {
//       console.error('Error cancelling policy:', error)
      
//       if (error.message?.includes('user rejected')) {
//         toast.error('Transaction was rejected')
//       } else if (error.message?.includes('InsurancePolicy_NoActivePolicy')) {
//         toast.error('No active policy found')
//       } else if (error.message?.includes('InsurancePolicy_OnlyPolicyOwnerIsAllowed')) {
//         toast.error('Only the policy owner can cancel')
//       } else {
//         toast.error(error.message || 'Failed to cancel policy')
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Don't show the button if there's no active policy
//   if (!policy?.active) {
//     return null
//   }

//   return (
//     <Button 
//       onClick={handleCancelPolicy} 
//       variant="destructive" 
//       disabled={isLoading || !policy?.active}
//       className="w-full"
//     >
//       {isLoading ? 'Cancelling...' : 'Cancel Policy'}
//     </Button>
//   )
// }




"use client";

import { useState } from 'react';
import { useWriteContract, useReadContract, useAccount, useConfig } from 'wagmi';
import { Button } from '@/components/ui/button';
import insuranceManagerABI from '@/contractData/InsuranceManager';
import { toast } from 'sonner';

const contractAddress = '0x51045De164CEB24f866fb788650748aEC8370769';

interface CancelPolicyProps {
  address?: `0x${string}`;
}

export function CancelPolicy({ address }: CancelPolicyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { address: connectedAddress } = useAccount();
  const config = useConfig();
  
  // Read current policy
  const { data: policy, refetch } = useReadContract({
    address: contractAddress,
    abi: insuranceManagerABI,
    functionName: 'getPolicy',
    args: [address || connectedAddress || '0x0'],
    query: {
      enabled: Boolean(address || connectedAddress),
    }
  });

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        console.error('Contract write error:', error);
        toast.error(error.message || 'Failed to cancel policy');
      },
    },
  });

  const handleCancelPolicy = async () => {
    if (!connectedAddress) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!policy?.active) {
      toast.error('No active policy found');
      return;
    }

    try {
      setIsLoading(true);
      
      const chainId = await config.state.chainId;
      
      if (!chainId) {
        toast.error('No blockchain network connected');
        return;
      }

      toast.loading('Preparing to cancel policy...');

      const tx = await writeContractAsync({
        address: contractAddress,
        abi: insuranceManagerABI,
        functionName: 'cancelPolicy',
        chainId,
      });

      toast.loading('Cancelling policy... Please wait for confirmation');

      // Wait for the transaction and refetch policy details
      await refetch();
      
      toast.success('Policy cancelled successfully!');
    } catch (error: any) {
      console.error('Error cancelling policy:', error);
      
      // More specific error handling
      if (error.message?.includes('rejected')) {
        toast.error('Transaction was rejected by user');
      } else if (error.message?.includes('network')) {
        toast.error('Please check your network connection');
      } else if (error.message?.includes('NoActivePolicy')) {
        toast.error('No active policy found');
      } else if (error.message?.includes('OnlyPolicyOwner')) {
        toast.error('Only the policy owner can cancel');
      } else {
        toast.error(error.message || 'Failed to cancel policy');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show nothing if there's no active policy
  if (!policy?.active) {
    return null;
  }

  return (
    <Button 
      onClick={handleCancelPolicy} 
      variant="destructive" 
      disabled={isLoading || !policy?.active || !connectedAddress}
      className="w-full mt-4"
    >
      {isLoading ? 'Cancelling...' : 'Cancel Policy'}
    </Button>
  );
}