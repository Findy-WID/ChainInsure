// 'use client'

// import { useContractWrite, usePrepareContractWrite } from 'wagmi'
// import { Button } from '@/components/ui/button'
// import { insuranceManagerABI } from '@/lib/contractABI'

// export function CancelPolicy() {
//   const { config } = usePrepareContractWrite({
//     address: '0x...',  // Replace with your contract address
//     abi: insuranceManagerABI,
//     functionName: 'cancelPolicy',
//   })

//   const { write } = useContractWrite(config)

//   return (
//     <Button onClick={() => write?.()} variant="destructive">Cancel Policy</Button>
//   )
// }