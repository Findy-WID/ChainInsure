"use client";

import { DashboardSidebar} from "@/components/DashboardSidebar"
import { DashboardTopbar } from "@/components/DashboardTopbar"
import { DashboardCards } from "@/components/DashboardCards"
import { DashboardTable } from "@/components/DashboardTable"
import { DashboardWallet } from "@/components/DashboardWallet"
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Home from "@/components/contract/Policy/page";
import VaultManager from "@/components/contract/VaultManager";
import { SecuredVault } from "@/components/contract/SecuredVault";


function Dashboard () {

      const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

    return (
        <div className="flex">
            <DashboardSidebar/>
            {/*Main Content */}
            <div className="bg-[#121A2F] w-full flex-1">
                <DashboardTopbar/>
                <div className="p-6">
                    <DashboardCards/>
                    <DashboardTable/>
                    <VaultManager />
                    {/* <SecuredVault /> */}
                    {/* <Home/> */}
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




