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
import { PolicyDetails } from "@/components/contract/Policy/PolicyDetail";
import { CreatePolicy } from "@/components/contract/Policy/CreatePolicy";
import { useState } from "react";
import { StakingPool } from "@/components/contract/StakingPool";

function Dashboard () {

      const { isConnected } = useAccount()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  const handleButtonClick = (section: string) => {
    setActiveSection(section)
    setModalOpen(true) // Open the modal when a button is clicked
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

    return (
        <div className="flex">
            <DashboardSidebar onButtonClick={handleButtonClick}/>
            {/*Main Content */}
            <div className="bg-[#121A2F] w-full flex-1">
                <DashboardTopbar/>
                <div className="p-6">
                    <DashboardCards/>
                    <DashboardTable/>
                    {/* {activeSection === 'vault' && <VaultManager />}
                    {activeSection === 'insurance' && <CreatePolicy />} */}

                    <CreatePolicy />

                </div>
            </div>
           
           {/*Wallet section */}
           <div className=''>
                <DashboardWallet/>
           </div>

           
            {/* Modal */}
            {/* {modalOpen && activeSection === 'vault' && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Vault Manager</h2>
                    <button onClick={handleModalClose} className="text-red-500">X</button>
                  </div>
                  
                  <VaultManager />

                </div>
              </div>
            )} */}
            
        </div>
    )
}

export default Dashboard


