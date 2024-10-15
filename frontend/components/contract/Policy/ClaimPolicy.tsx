// 'use client'

// import { useContractWrite, usePrepareContractWrite } from 'wagmi'
// import { Button } from '@/components/ui/button'
// import { insuranceManagerABI } from '@/contractABI/insuranceManagerABI'
// ;
// export function ClaimPolicy() {
//   const { config } = usePrepareContractWrite({
//     address: '0x...',  // Replace with your contract address
//     abi: insuranceManagerABI,
//     functionName: 'claimPolicy',
//   })

//   const { write } = useContractWrite(config)

//   return (
//     <Button onClick={() => write?.()}>Claim Policy</Button>
//   )
// }