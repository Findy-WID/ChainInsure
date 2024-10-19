"use client";

import { DashboardSidebar} from "@/components/DashboardSidebar"
import { DashboardTopbar } from "@/components/DashboardTopbar"
import { DashboardCards } from "@/components/DashboardCards"
import { DashboardTable } from "@/components/DashboardTable"
import { DashboardWallet } from "@/components/DashboardWallet"
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useState } from "react";
import { EyeOff, ScanEye, ScanEyeIcon } from "lucide-react";

function Dashboard () {

  const { isConnected } = useAccount()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)


  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  const handleButtonClick = (section: string) => {
    setActiveSection(section)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

    return (
        <div className="grid grid-row md:grid-cols-4 md:flex-row w-full">
            <DashboardSidebar onButtonClick={handleButtonClick} isOpen={isOpen} handleModalClose={handleModalClose}/>
            {/*Main Content */}
            <div className="bg-[#121A2F] w-full md:col-span-2">
                <DashboardTopbar toggleSidebar={toggleSidebar} isOpen={isOpen}/>
                <div className="p-6 min-h-screen w-full">
                    <DashboardCards/>
                    <DashboardTable/>
                    {/* {activeSection === 'vault' && <VaultManager />}
                    {activeSection === 'insurance' && <CreatePolicy />} */}

                    {/* <CreatePolicy /> */}

                </div>
            </div>
           
           {/*Wallet section */}
           <div className="hidden md:block md:min-h-screen">
           <DashboardWallet handleModalClose={handleModalClose}/>
           </div>
          
               
           
            
        </div>
    )
}

export default Dashboard


