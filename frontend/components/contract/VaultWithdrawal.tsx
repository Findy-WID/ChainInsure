'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { toast } from 'sonner'

import securedVaultABI from '../../contractData/SecuredVault'
import managerABI from '../../contractData/Manager'




const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D'


// type UserStake = {
//     amount: bigint;
//     rewardDebt: bigint;
//     lastStakeTime: bigint;
//   }


//todo 
//withdrawal doing 
export default function VaultWithdrawal({handleModalClose}:{handleModalClose: ()=>void}) {

    
    const {data:hash, isPending:isWithdrawing, writeContractAsync:withdraw} = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash,})

    const [withdrawAmount, setWithdrawAmount] = useState('0')
    const [withdrawAddress, setWithdrawAddress] = useState('')

    const { address } = useAccount();

    const {data:vaultAddress, error, isPending} = useReadContract({
      address:MANAGER_CONTRACT_ADDRESS,
      abi:managerABI,
      functionName:'getVaultAddress',
      args:[address] as any
    })

    const { data: vaultBalance } = useReadContract({
      address: MANAGER_CONTRACT_ADDRESS,
      abi: managerABI,
      functionName: 'getVaultBalance',
      args: [address] as any,
    });


    // console.log(vaultAddress)

    

    const userVaultBalance = vaultBalance ?? BigInt(0)


    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!withdrawAddress || !withdrawAmount || !withdraw) return

        if(parseEther(withdrawAmount) > userVaultBalance){
          toast.error(`The withdrwal amount must be less than or equal to  ${formatEther(userVaultBalance)}`)
          return;
        }
    
        try {

          if (!withdraw) {
            throw new Error('Withdrawal function is unavailable');
          }

          await withdraw({
            address: vaultAddress as `0x${string}`,
            abi: securedVaultABI,
            functionName: 'sendFunds',
            args: [withdrawAddress, parseEther(withdrawAmount)] as any
          })

          toast.success('Withdrawal request sent')

          
        } catch (error) {
          toast.error('Withdrawal failed')
          console.error(error)
        }
    }

  
    useEffect(() => {
      if (isConfirmed) {
        toast.success('Withdrawal successful');
  
        // Set a timeout to close the modal after 5 seconds
        const timeoutId = setTimeout(() => {
          handleModalClose();
        }, 5000); // 5000ms = 5 seconds
  
        // Cleanup function to clear timeout if component unmounts before 5 seconds
        return () => clearTimeout(timeoutId);
      }
    }, [isConfirmed, handleModalClose]);

  

  return (
    <Card>
      <CardHeader>
          <CardTitle>Withdraw Funds From Your Vault</CardTitle>
      </CardHeader>

      <CardContent>
      <form onSubmit={handleWithdraw} className="space-y-4">
            <Label htmlFor='withdrawAddress'>Withdrawal Address</Label>
            <Input id='withdrawAddress' value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} type='text' required/>

            <Label htmlFor="withdrawAmount">Withdraw Amount (ETH)</Label>
            <Input
              id="withdrawAmount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              type="number"
              step="0.000000001"
              min="0"
              max={formatEther(userVaultBalance)}
              required
            />
            <Button type="submit" disabled={isWithdrawing || isConfirming}>
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
            </Button>
            {isConfirming && (
              <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                <p className="font-bold">Waiting for confirmation...</p>
                <p>Your transaction is being processed. Please wait.</p>
              </div>
            )}

            {isConfirmed && (
              <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                <p className="font-bold">Transaction confirmed!</p>
                <p>Your transaction has been successfully confirmed. You can now close this page.</p>
              </div>
            )}
          </form>
      </CardContent>
    </Card>
    )
}
