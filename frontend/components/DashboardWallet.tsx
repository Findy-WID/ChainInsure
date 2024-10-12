




export function DashboardWallet() {
    return (
      <div className="bg-[#0C0E1A] p-6 text-white pt-32 w-64 h-screen">
        <h3 className="text-lg font-semibold">My Wallet</h3>
        <p className="text-3xl font-bold my-4">25,874 <span className="text-sm">ETH</span></p>
        <div className="space-y-2">
          <p>Earnings: <span className="text-green-400">7.048 ETH</span></p>
          <p>Spending: <span className="text-red-400">2.013 ETH</span></p>
        </div>
        <button className="bg-green-500 w-full py-2 rounded-lg mt-4">Deposit</button>
        <button className="bg-blue-500 w-full py-2 rounded-lg mt-4">Withdraw</button>
      </div>
    );
  }
  