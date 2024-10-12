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