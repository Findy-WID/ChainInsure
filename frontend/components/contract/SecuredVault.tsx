'use client'

import { useState } from 'react'
import {  useReadContract, useAccount, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import  managerABI  from '../../contractData/Manager';
import  securedVaultABI  from '../../contractData/SecuredVault';

const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D'; // Replace with the actual contract address

export function SecuredVault({vaultAddress, userAddress }: { vaultAddress: `0x${string}`, userAddress: `0x${string}` }) {
  const [depositAmount, setDepositAmount] = useState('')
  const { address } = useAccount();
  const {data: hash, sendTransaction} = useSendTransaction();

  const { data: vaultBalance } = useReadContract({
    address: vaultAddress,
    abi: securedVaultABI,
    functionName: 'getBalance',
    args: [userAddress] as any,
  })

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    sendTransaction({to: vaultAddress, value: parseEther(depositAmount || '0')})

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Secured Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <p> {`Balance: ${vaultBalance ? parseEther(vaultBalance.toString()) : '0'} ETH`}</p>
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