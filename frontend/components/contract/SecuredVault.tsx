'use client'

import { useState } from 'react'
import { useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { securedVaultABI } from '@/lib/contractABI'

const vaultAddress = '0x...' // Replace with your SecuredVault contract address

export function SecuredVault({ userAddress }: { userAddress: `0x${string}` }) {
  const [depositAmount, setDepositAmount] = useState('')

  const { data: vaultBalance } = useContractRead({
    address: vaultAddress,
    abi: securedVaultABI,
    functionName: 'getBalance',
    args: [userAddress],
  })

  const { config: depositConfig } = usePrepareContractWrite({
    address: vaultAddress,
    abi: securedVaultABI,
    functionName: 'deposit',
    args: [parseEther(depositAmount || '0')],
  })

  const { write: deposit } = useContractWrite(depositConfig)

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    deposit?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Secured Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Balance: {vaultBalance ? parseEther(vaultBalance.toString()) : '0'} ETH</p>
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