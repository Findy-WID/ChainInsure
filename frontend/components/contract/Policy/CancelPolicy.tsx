'use client';

import { useWriteContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import insuranceManagerABI from '@/contractData/InsuranceManager';
import { toast } from 'sonner'

const contractAddress = '0x51045De164CEB24f866fb788650748aEC8370769';

export function CancelPolicy() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract()

  const handleCancelPolicy = async () => {
    try {
      await writeContract({
        address: contractAddress,
        abi: insuranceManagerABI,
        functionName: 'cancelPolicy',
      })
      toast.success('Policy cancellation request sent.')
    } catch (error) {
      console.error('Error cancelling policy:', error)
      toast.error('Failed to cancel policy.')
    }
  }

  // Provide feedback on success or error after writing the contract
  if (isSuccess) {
    toast.success('Policy cancelled successfully!')
  }
  if (isError) {
    toast.error('Error cancelling policy.')
  }

  return (
    <Button 
      onClick={handleCancelPolicy} 
      variant="destructive" 
      disabled={isPending}
    >
      {isPending ? 'Cancelling...' : 'Cancel Policy'}
    </Button>
  )
}