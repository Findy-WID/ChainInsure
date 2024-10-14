


import { useState } from 'react'
import { useReadContract, useAccount, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import securedVaultABI from '../../contractData/SecuredVault'

export function SecuredVault({ vaultAddress, userAddress }: { vaultAddress: `0x${string}`, userAddress: `0x${string}` }) {
  const [depositAmount, setDepositAmount] = useState('')
  const { address } = useAccount();
  const { data: hash, sendTransaction } = useSendTransaction();

  const { data: vaultBalance } = useReadContract({
    address: vaultAddress,
    abi: securedVaultABI,
    functionName: 'getBalance',
    args: [userAddress] as any,
  })

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    sendTransaction({ to: vaultAddress, value: parseEther(depositAmount || '0') })
  }
  console.log(vaultBalance)
  console.log(vaultAddress)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Secured Vault</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display the Vault Address */}
        <p>{`Vault Address: ${vaultAddress}`}</p>
        
        {/* Display the Vault Balance */}
        <p>{`Balance: ${vaultBalance ? parseEther(vaultBalance.toString()) : '0'} ETH`}</p>
        
        {/* Deposit Form */}
        <form onSubmit={handleDeposit} className="mt-4">
          <Label htmlFor="depositAmount">Deposit Amount (ETH)</Label>
          <Input
            id="depositAmount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            type="number"
            step="0.01"
            required
          />
          <Button type="submit" className="mt-2">Deposit</Button>
        </form>
      </CardContent>
    </Card>
  )
}
