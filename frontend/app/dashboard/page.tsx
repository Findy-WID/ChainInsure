import { DashboardSidebar} from "@/components/DashboardSidebar"
import { DashboardTopbar } from "@/components/DashboardTopbar"
import { DashboardCards } from "@/components/DashboardCards"
import { DashboardTable } from "@/components/DashboardTable"
import { DashboardWallet } from "@/components/DashboardWallet"


function Dashboard () {
    return (
        <div className="flex">
            <DashboardSidebar/>
            {/*Main Content */}
            <div className="bg-[#121A2F] w-full flex-1">
                <DashboardTopbar/>
                <div className="p-6">
                    <DashboardCards/>
                    <DashboardTable/>
                </div>
            </div>
           
           {/*Wallet section */}
           <div className=''>
                <DashboardWallet/>
           </div>
        </div>
    )
}

export default Dashboard




// 'use client'

// import { useAccount } from 'wagmi'
// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'

// export default function Dashboard() {
//   const { isConnected } = useAccount()
//   const router = useRouter()

//   useEffect(() => {
//     if (!isConnected) {
//       router.push('/')
//     }
//   }, [isConnected, router])

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
//       <p>Welcome to your Chain Insure dashboard!</p>
//       {/* Add more dashboard content here */}
//     </div>
//   )
// }