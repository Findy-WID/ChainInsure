'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useWriteContract, useReadContract, useAccount} from 'wagmi'
import { toast } from 'sonner'
import { Eye, EyeOff, ScanEye } from 'lucide-react'


import securedVaultABI from '../../contractData/SecuredVault'
import managerABI from '../../contractData/Manager';

const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D'



export default function SetSecret() {
    const { address } = useAccount();
    const {writeContractAsync, isPending} = useWriteContract()
    const [secret, setSecret] = useState('')
    const [showSecret, setShowSecret] = useState(false)
    

    //to do
    //setSecret not working

    const {data:vaultAddress, error} = useReadContract({
      address:MANAGER_CONTRACT_ADDRESS,
      abi:managerABI,
      functionName:'getVaultAddress',
      args:[address] as any
      })



    const handleCreateSecret = async (e: React.FormEvent) => {
        e.preventDefault()
        if(secret){
            try {
                await writeContractAsync({
                    address: vaultAddress as `0x${string}`,
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
            <CardTitle>Update Your Secret</CardTitle>
            <CardDescription>Enter new secret for accessing vault (Remember to keep your secret SECRET!)</CardDescription>
        </CardHeader>

        <CardContent>
           <form  onSubmit={handleCreateSecret} className="space-y-4">
            <Label htmlFor="secret">Secret</Label>
            <div className="flex">
            <Input id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              type={showSecret ? 'text' : 'password'}
              placeholder='Enter a new secret'
              required/>
            
            <Button type='button' className='ml-2' onClick={()=>setShowSecret(!showSecret)}>
              {showSecret ? <EyeOff size={20} /> : <ScanEye size={20} />}
            </Button>
            </div>
            
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
           </form>
        </CardContent>
    </Card>
  )
}
