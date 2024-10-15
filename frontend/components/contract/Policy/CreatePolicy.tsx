'use client'

import { useState } from 'react'
import { useContractWrite, useSimulateContract, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import insuranceManager from '@/contractData/InsuranceManager';

const contractAddress = '0x6D0ceF6a337bF944bc4E002b91D445dE6E28aD08' // Replace with your contract address
const MIN_VALUE = parseEther('1')
const MAX_VALUE = parseEther('1000000')

export function CreatePolicy() {
  const [coverageAmount, setCoverageAmount] = useState('')
  const [premium, setPremium] = useState('')
  const [period, setPeriod] = useState('')

  const { data } = useSimulateContract({
    address: contractAddress,
    abi: insuranceManager,
    functionName: 'createPolicy',
    args: [parseEther(coverageAmount || '0'), parseEther(premium || '0'), BigInt(period || '0')],
  })

  const { write, isPending, isSuccess, isError } = useWriteContract(data)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const coverageEther = parseEther(coverageAmount)
    if (coverageEther < MIN_VALUE || coverageEther > MAX_VALUE) {
      toast.error('Coverage amount must be between 1 ETH and 1,000,000 ETH')
      return
    }
    write?.()
  }

  if (isPending) {
    toast.loading('Creating policy...')
  }

  if (isSuccess) {
    toast.success('Policy created successfully!')
  }

  if (isError) {
    toast.error('Error creating policy. Please try again.')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="coverageAmount">Coverage Amount (ETH)</Label>
        <Input
          id="coverageAmount"
          value={coverageAmount}
          onChange={(e) => setCoverageAmount(e.target.value)}
          type="number"
          step="0.01"
          min="1"
          max="1000000"
          required
        />
      </div>
      <div>
        <Label htmlFor="premium">Premium (ETH)</Label>
        <Input
          id="premium"
          value={premium}
          onChange={(e) => setPremium(e.target.value)}
          type="number"
          step="0.01"
          required
        />
      </div>
      <div>
        <Label htmlFor="period">Period (days)</Label>
        <Input
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          type="number"
          min="1"
          required
        />
      </div>
      <Button type="submit">Create Policy</Button>
    </form>
  )
}