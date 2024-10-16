'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useWriteContract, useReadContract } from 'wagmi'
import { toast } from 'sonner'


import securedVaultABI from '../../contractData/SecuredVault'

const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D'



export default function SetSecret() {
    const {writeContract, isPending} = useWriteContract()
    const [secret, setSecret] = useState('')

    // const {data:vaultAddress, error, isPending} = useReadContract({
    //   address:MANAGER_CONTRACT_ADDRESS,
    //   abi:managerABI,
    //   functionName:'getVaultAddress',
    //   args:[address] as any
    //     })



    const handleCreateSecret = async (e: React.FormEvent) => {
        e.preventDefault()
        if(secret){
            try {
                writeContract({
                    address: MANAGER_CONTRACT_ADDRESS,
                    abi: securedVaultABI,
                    functionName: 'setSecret',
                    args: [secret],
                })
                toast.success('New secret created successfully')
            } catch (error) {
                toast.error('Error creating secret')
                console.log(error)
            }
        }
    }




  return (
    <Card>
        <CardHeader>
            <CardTitle>Create New Secret</CardTitle>
            <CardDescription>Enter new secret for accessing vault (Remember to keep your secret SECRET!)</CardDescription>
        </CardHeader>

        <CardContent>
           <form  onSubmit={handleCreateSecret} className="space-y-4">
            <Label htmlFor="secret">Secret</Label>
            <Input id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              type="password"
              placeholder='Enter a new secret'
              required/>
            
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
           </form>
        </CardContent>
    </Card>
  )
}
