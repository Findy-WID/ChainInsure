import React from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown, 
  WalletDropdownLink, 
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';


export function DashboardTopbar() {
  return (
    <div className='flex justify-between items-center p-4 text-white bg-[#0C0E1A]'>
        <div className="flex items-center w-full max-w-lg relative">
            <input type="text" name="search" id="search" className="w-full bg-transparent border rounded-lg border-gray-400 text-white px-10 py-2 focus:outline-none " placeholder="Find something here..."/>

            <Search className='absolute right-4'/>

        </div>

        <div className="flex items-center space-x-4">
           
            <div className="flex justify-between items-center rounded-lg text-white bg-[#ffffff]">
      <div className="flex justify-end">
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className={color.primary} />
              <EthBalance />
            </Identity>
            <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
              Wallet
            </WalletDropdownLink>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
        </div>
    </div>
  )
}
