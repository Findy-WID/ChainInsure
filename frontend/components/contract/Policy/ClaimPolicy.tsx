'use client'

import { useWriteContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import InsuranceManagerABI from '../../../contractData/InsuranceManager';
import { toast } from 'sonner'
import { useState } from 'react'

const contractAddress = '0x51045De164CEB24f866fb788650748aEC8370769';

export function ClaimPolicy() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract()
  const [isClaimPending, setIsClaimPending] = useState(false)

  const handleClaimPolicy = async () => {
    setIsClaimPending(true)
    try {
      await writeContract({
        address: contractAddress,
        abi: InsuranceManagerABI,
        functionName: 'claimPolicy',
      })
      
      // If the function reaches this point without throwing an error, we consider it a success
      toast.success('Policy claim request sent.')
    } catch (error) {
      console.error('Error claiming policy:', error)
      toast.error('Failed to claim policy.')
    } finally {
      setIsClaimPending(false)
    }
  }

  // Provide feedback on success or error after writing the contract
  if (isSuccess) {
    toast.success('Policy claimed successfully!')
  }
  if (isError) {
    toast.error('Error claiming policy.')
  }


  return (
    <Button 
      onClick={handleClaimPolicy} 
      disabled={isPending || isClaimPending}
    >
      {isPending || isClaimPending ? 'Claiming...' : 'Claim Policy'}
    </Button>
  )
}


// vault address 