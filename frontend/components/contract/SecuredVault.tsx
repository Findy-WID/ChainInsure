


// import { useState } from 'react'
// import { useReadContract, useAccount, useSendTransaction } from 'wagmi'
// import { parseEther } from 'viem'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import securedVaultABI from '../../contractData/SecuredVault'

// export function SecuredVault({ vaultAddress, userAddress }: { vaultAddress: `0x${string}`, userAddress: `0x${string}` }) {
//   const [depositAmount, setDepositAmount] = useState('')
//   const { address } = useAccount();
//   const { data: hash, sendTransaction } = useSendTransaction();

//   const { data: vaultBalance } = useReadContract({
//     address: vaultAddress,
//     abi: securedVaultABI,
//     functionName: 'getBalance',
//     args: [userAddress] as any,
//   })

//   const handleDeposit = (e: React.FormEvent) => {
//     e.preventDefault()
//     sendTransaction({ to: vaultAddress, value: parseEther(depositAmount || '0') })
//   }
//   console.log(vaultBalance)
//   console.log(vaultAddress)

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Your Secured Vault</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {/* Display the Vault Address */}
//         <p>{`Vault Address: ${vaultAddress}`}</p>
        
//         {/* Display the Vault Balance */}
//         <p>{`Balance: ${vaultBalance ? parseEther(vaultBalance.toString()) : '0'} ETH`}</p>
        
//         {/* Deposit Form */}
//         <form onSubmit={handleDeposit} className="mt-4">
//           <Label htmlFor="depositAmount">Deposit Amount (ETH)</Label>
//           <Input
//             id="depositAmount"
//             value={depositAmount}
//             onChange={(e) => setDepositAmount(e.target.value)}
//             type="number"
//             step="0.01"
//             required
//           />
//           <Button type="submit" className="mt-2">Deposit</Button>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }





import { useState } from 'react'
import { useReadContract, useAccount, useSendTransaction, useWriteContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Eye, EyeOff, ScanEye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import securedVaultABI from '../../contractData/SecuredVault'

export function SecuredVault({ vaultAddress, userAddress }: { vaultAddress: `0x${string}`, userAddress: `0x${string}` }) {
  const [depositAmount, setDepositAmount] = useState('')
  const [unfreezeSecret, setUnfreezeSecret] = useState('')
  const [newThreshold, setNewThreshold] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const { address } = useAccount()
  const { data: hash, sendTransaction } = useSendTransaction()
  const { writeContract } = useWriteContract()

  const { data: vaultBalance } = useReadContract({
    address: vaultAddress,
    abi: securedVaultABI,
    functionName: 'getBalance',
  })

  const { data: accountStatus } = useReadContract({
    address: vaultAddress,
    abi: securedVaultABI,
    functionName: 'getAccountStatus',
  })

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(depositAmount)
    if (amount < 0.001 || amount > 1000) {
      alert('Deposit amount must be between 0.001 and 1000 ETH')
      return
    }
    sendTransaction({ to: vaultAddress, value: parseEther(depositAmount || '0') })
  }

  const handleUnfreeze = () => {
    writeContract({
      address: vaultAddress,
      abi: securedVaultABI,
      functionName: 'unfreezeAccount',
      args: [unfreezeSecret],
    })
  }

  const handleSetThreshold = () => {
    const threshold = parseFloat(newThreshold)
    if (threshold < 0.001 || threshold > 1000) {
      alert('Threshold must be between 0.001 and 1000 ETH')
      return
    }
    writeContract({
      address: vaultAddress,
      abi: securedVaultABI,
      functionName: 'setThreshold',
      args: [parseEther(newThreshold)],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Your Secured Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Vault Address: {vaultAddress}</p>
        <p>Balance: {vaultBalance ? formatEther(vaultBalance) : '0'} ETH</p>
        <p>Account Status: {accountStatus ? 'Frozen' : 'Active'}</p>

        <Tabs defaultValue="deposit" className="mt-4">
          <TabsList>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="unfreeze" disabled={!accountStatus}>Unfreeze</TabsTrigger>
            <TabsTrigger value="threshold">Set Threshold</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <form onSubmit={handleDeposit} className="space-y-4">
              <Label htmlFor="depositAmount">Deposit Amount (ETH)</Label>
              <Input
                id="depositAmount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                type="number"
                step="0.001"
                min="0.001"
                max="1000"
                required
              />
              <Button type="submit">Deposit</Button>
            </form>
          </TabsContent>

          <TabsContent value="unfreeze">
            <div className="space-y-4">
              <Label htmlFor="unfreezeSecret">Unfreeze Secret</Label>
              <div className="flex">
                <Input
                  id="unfreezeSecret"
                  type={showSecret ? 'text' : 'password'}
                  value={unfreezeSecret}
                  onChange={(e) => setUnfreezeSecret(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="ml-2"
                >
                  {showSecret ? <EyeOff size={20} /> : <ScanEye size={20} />}
                </Button>
              </div>
              <Button onClick={handleUnfreeze}>Unfreeze Account</Button>
            </div>
          </TabsContent>

          <TabsContent value="threshold">
            <div className="space-y-4">
              <Label htmlFor="newThreshold">New Threshold (ETH)</Label>
              <Input
                id="newThreshold"
                type="number"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                step="0.001"
                min="0.001"
                max="1000"
              />
              <Button onClick={handleSetThreshold}>Set New Threshold</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}