
import React from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { Search, Clipboard, Check } from 'lucide-react';
import { ModalWrapper } from '@/components/ui/ModalWrapper/Index';
import VaultWithdrawal from './contract/VaultWithdrawal';
import SetSecret from './contract/SetSecret';
import { formatEther } from 'viem';
import managerABI from '../contractData/Manager'
import { useState } from 'react';


const MANAGER_CONTRACT_ADDRESS = '0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D';

export function DashboardWallet({handleModalClose}:{handleModalClose: () => void}) {
  const [copied, setCopied] = useState<boolean>(false)
  const { address } = useAccount();

  const { data: ethBalance } = useBalance({ 
    address: address as `0x${string}` 
  });

  const { data: vaultAddress } = useReadContract({
    address: MANAGER_CONTRACT_ADDRESS,
    abi: managerABI,
    functionName: 'getVaultAddress',
    args: [address] as any,
  });

  const handleCopy = () => {
    if (vaultAddress) {
      navigator.clipboard.writeText(vaultAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    }
  }
  return (
    <aside className="bg-[#0C0E1A] p-6 text-white md:pt-32 md:h-full">
      <h3 className="text-lg font-semibold mb-2">My Wallet</h3>
      <div className='flex flex-col text-center border border-blue-500 rounded-md py-4'>
        <p className='text-[#C8C8C8] text-xs'>Your Balance</p>
        <p className="text-3xl font-bold mb-4">
          {ethBalance ? Number(formatEther(ethBalance.value)).toFixed(3) : '0'} <span className="text-sm">ETH</span>
        </p>
        <div className="space-y-2 text-left px-2">
          <div className="flex items-center space-x-2">
            {vaultAddress ? (
              <div className="flex items-center space-x-2 bg-[#1A233B] text-white px-4 py-2 rounded-lg">
                {/* Display wallet address */}
                <p>Your Vault Address: <span className="text-sm truncate">{`${vaultAddress.slice(0, 6)}...${vaultAddress.slice(-4)}`}</span></p>

                {/* Copy button */}
                <button onClick={handleCopy} className="ml-2 text-white hover:text-gray-400">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" /> // Check icon after copy
                  ) : (
                    <Clipboard className="w-4 h-4" /> // Clipboard icon before copy
                  )}
                </button>
              </div>
            ) : (
              <p className='text-center'>Your Vault Address: <span>No vault found</span></p>
            )}
          </div>
            <p>
              Spending: <span className="text-red-400">2.013 ETH</span>
            </p>
          </div>
      </div>
      

      {/*Set secret modal  */}
      <ModalWrapper triggerElement={<button className="bg-green-500 w-full py-2 rounded-full mt-4 capitalize">update vault secret</button>} title="Set Secret" content={<SetSecret/>} children={<SetSecret/>}/>
      

      {/* Withdrawal Modal*/}
      <ModalWrapper
        triggerElement={
          <button className="bg-blue-500 w-full py-2 rounded-full mt-4">
            Withdraw
          </button>
        }
        title="Withdraw Funds"
        content={<VaultWithdrawal handleModalClose={handleModalClose}/>}
        children={<VaultWithdrawal  handleModalClose={handleModalClose}/>}
      />
    </aside>
  );
}
