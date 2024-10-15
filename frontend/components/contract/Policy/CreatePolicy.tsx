// 'use client'

// import { useState } from 'react'
// import { useContractWrite, useSimulateContract, useWriteContract } from 'wagmi'
// import { parseEther } from 'viem'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { toast } from 'sonner'
// import insuranceManager from '@/contractData/InsuranceManager';

// const contractAddress = '0x6D0ceF6a337bF944bc4E002b91D445dE6E28aD08' // Replace with your contract address
// const MIN_VALUE = parseEther('1')
// const MAX_VALUE = parseEther('1000000')

// export function CreatePolicy() {
//   const [coverageAmount, setCoverageAmount] = useState('')
//   const [premium, setPremium] = useState('')
//   const [period, setPeriod] = useState('')

//   const simulateContract = useSimulateContract({
//     address: contractAddress,
//     abi: insuranceManager,
//     functionName: 'createPolicy',
//     args: [parseEther(coverageAmount || '0'), parseEther(premium || '0'),       period ? BigInt(period).toString() : undefined, ],
//   })

//   const { data, isPending, isSuccess, isError } = useWriteContract()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const coverageEther = parseEther(coverageAmount)
//     if (coverageEther < MIN_VALUE || coverageEther > MAX_VALUE) {
//       toast.error('Coverage amount must be between 1 ETH and 1,000,000 ETH')
//       return
//     }
//     simulateContract.write?.()
//   }

//   if (isPending) {
//     toast.loading('Creating policy...')
//   }

//   if (isSuccess) {
//     toast.success('Policy created successfully!')
//   }

//   if (isError) {
//     toast.error('Error creating policy. Please try again.')
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="coverageAmount">Coverage Amount (ETH)</Label>
//         <Input
//           id="coverageAmount"
//           value={coverageAmount}
//           onChange={(e) => setCoverageAmount(e.target.value)}
//           type="number"
//           step="0.01"
//           min="1"
//           max="1000000"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="premium">Premium (ETH)</Label>
//         <Input
//           id="premium"
//           value={premium}
//           onChange={(e) => setPremium(e.target.value)}
//           type="number"
//           step="0.01"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="period">Period (days)</Label>
//         <Input
//           id="period"
//           value={period}
//           onChange={(e) => setPeriod(e.target.value)}
//           type="number"
//           min="1"
//           required
//         />
//       </div>
//       <Button type="submit">Create Policy</Button>
//     </form>
//   )
// }





// 'use client';

// import { useState } from 'react'
// import { useSimulateContract, useWriteContract } from 'wagmi'
// import { parseEther } from 'viem'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { toast } from 'sonner'
// import insuranceManager from '@/contractData/InsuranceManager'; 

// const contractAddress = '0x6D0ceF6a337bF944bc4E002b91D445dE6E28aD08' // Replace with your contract address
// const MIN_VALUE = parseEther('1')
// const MAX_VALUE = parseEther('1000000')

// export function CreatePolicy() {
//   const [coverageAmount, setCoverageAmount] = useState('')
//   const [premium, setPremium] = useState('')
//   const [period, setPeriod] = useState('')

//   // Simulate contract call before writing to the blockchain
//   const { data: simulationData } = useSimulateContract({
//     address: contractAddress,
//     abi: insuranceManager,
//     functionName: 'createPolicy',
//     args: [
//       parseEther(coverageAmount || '0'), // Convert to ether
//       parseEther(premium || '0'),        // Convert to ether
//       // period ? BigInt(period) : 0,       // Period as BigInt
//     ],
//   })

//   const {  writeContract } = useWriteContract()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const coverageEther = parseEther(coverageAmount)
//     if (coverageEther < MIN_VALUE || coverageEther > MAX_VALUE) {
//       toast.error('Coverage amount must be between 1 ETH and 1,000,000 ETH')
//       return
//     }

//     if (simulationData?.request) {
//       writeContract(simulationData.request) // Call the contract write function
//     } else {
//       toast.error('Simulation failed or invalid request.')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="coverageAmount">Coverage Amount (ETH)</Label>
//         <Input
//           id="coverageAmount"
//           value={coverageAmount}
//           onChange={(e) => setCoverageAmount(e.target.value)}
//           type="number"
//           step="0.01"
//           min="1"
//           max="1000000"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="premium">Premium (ETH)</Label>
//         <Input
//           id="premium"
//           value={premium}
//           onChange={(e) => setPremium(e.target.value)}
//           type="number"
//           step="0.01"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="period">Period (days)</Label>
//         <Input
//           id="period"
//           value={period}
//           onChange={(e) => setPeriod(e.target.value)}
//           type="number"
//           min="1"
//           required
//         />
//       </div>
//       <Button type="submit" disabled={!Boolean(simulationData?.request)}>
//         Create Policy
//       </Button>
//     </form>
//   )
// }



// 'use client';

// import { useState, useEffect } from 'react'
// import { useSimulateContract, useWriteContract } from 'wagmi'
// import { parseEther } from 'viem'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { toast } from 'sonner'
// import insuranceManager from '@/contractData/InsuranceManager'; 

// const contractAddress = '0x51045De164CEB24f866fb788650748aEC8370769' // Replace with your contract address
// const MIN_VALUE = parseEther('0.000001')
// const MAX_VALUE = parseEther('1000000')

// export function CreatePolicy() {
//   const [coverageAmount, setCoverageAmount] = useState('')
//   const [premium, setPremium] = useState('')
//   const [period, setPeriod] = useState('')
//   const [isReady, setIsReady] = useState(false)

//   // Simulate contract call before writing to the blockchain
//   const { data: simulationData, refetch } = useSimulateContract({
//     address: contractAddress,
//     abi: insuranceManager,
//     functionName: 'createPolicy',
//     args: [
//       parseEther(coverageAmount || '0'), // Convert to ether
//       parseEther(premium || '0'),        // Convert to ether
//       period ? BigInt(period) : BigInt(0), // Convert period to BigInt
//     ],
//     enabled: Boolean(coverageAmount && premium && period), // Only run if all fields are filled
//   })

//   const { writeContract } = useWriteContract()

//   // Check if form is ready and the simulation is successful
//   useEffect(() => {
//     if (simulationData?.request) {
//       setIsReady(true)
//     } else {
//       setIsReady(false)
//     }
//   }, [simulationData])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const coverageEther = parseEther(coverageAmount)
//     if (coverageEther < MIN_VALUE || coverageEther > MAX_VALUE) {
//       toast.error('Coverage amount must be between 1 ETH and 1,000,000 ETH')
//       return
//     }

//     if (simulationData?.request) {
//       writeContract(simulationData.request) // Call the contract write function
//     } else {
//       toast.error('Simulation failed or invalid request.')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="coverageAmount">Coverage Amount (ETH)</Label>
//         <Input
//           id="coverageAmount"
//           value={coverageAmount}
//           onChange={(e) => setCoverageAmount(e.target.value)}
//           type="number"
//           step="0.01"
//           min="1"
//           max="1000000"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="premium">Premium (ETH)</Label>
//         <Input
//           id="premium"
//           value={premium}
//           onChange={(e) => setPremium(e.target.value)}
//           type="number"
//           step="0.01"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="period">Period (days)</Label>
//         <Input
//           id="period"
//           value={period}
//           onChange={(e) => setPeriod(e.target.value)}
//           type="number"
//           min="1"
//           required
//         />
//       </div>
//       <Button type="submit" disabled={!isReady}>
//         Create Policy
//       </Button>
//     </form>
//   )
// }




import { useState, useEffect } from 'react';
import { useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import insuranceManagerABI from '@/contractData/InsuranceManager';

const contractAddress = '0x51045De164CEB24f866fb788650748aEC8370769'; // Replace with your contract address
const MIN_VALUE = parseEther('0.000001');
const MAX_VALUE = parseEther('1000000');

export function CreatePolicy() {
  const [coverageAmount, setCoverageAmount] = useState('');
  const [period, setPeriod] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Check the contract state (optional, based on your contract's functions)
  const { data: contractState } = useReadContract({
    address: contractAddress,
    abi: insuranceManagerABI,
    functionName: 'checkPolicyValidity', 
  });
  const { data: createPolicy, isPending, isSuccess, isError } = useWriteContract({
    address: contractAddress,
    interface: insuranceManagerABI,
    functionName: 'createPolicy',
    args: [
      parseEther(coverageAmount || '0'), // Convert coverage amount to ether
      period ? BigInt(period) : BigInt(0), // Convert period to BigInt
    ],
  });
  console.log(createPolicy);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const coverageEther = parseEther(coverageAmount || '0');
    if (coverageEther < MIN_VALUE || coverageEther > MAX_VALUE) {
      toast.error('Coverage amount must be between 0.000001 ETH and 1,000,000 ETH');
      return;
    }

    if (createPolicy) {
      toast.success('Transaction sent successfully.');
      console.log(createPolicy);
    } else {
      toast.error('Transaction failed.');
    }
    console.log(createPolicy);

  };

  // Provide feedback on success or error after writing the contract
  useEffect(() => {
    if (isSuccess) {
      toast.success('Policy created successfully!');
    }
    if (isError) {
      toast.error('Error creating policy.');
    }
  }, [isSuccess, isError]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="coverageAmount">Coverage Amount (ETH)</Label>
        <Input
          id="coverageAmount"
          value={coverageAmount}
          onChange={(e) => setCoverageAmount(e.target.value)}
          type="number"
          step="0.000001"
          min="0.000001"
          max="1000000"
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
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating Policy...' : 'Create Policy'}
      </Button>
    </form>
  );
}
