import React from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
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


export function DashboardTopbar({toggleSidebar, isOpen}:{toggleSidebar:()=>void, isOpen:boolean}) {

  // const [isOpen, setIsOpen] = useState<boolean>(false)

  // const toggleSidebar = () => {
  //   setIsOpen(!isOpen)
  // }
  return (
    <div className='flex justify-between space-x-4 items-center p-4 text-white bg-[#0C0E1A]'>
        <div className="flex items-center w-full max-w-lg relative">

            {/* Hamburger Menu for Mobile */}
            <button
              className="text-white md:hidden p-4"
              onClick={toggleSidebar}
            >
              {isOpen ? <X /> : <Menu />}
            </button>

            <input type="text" name="search" id="search" className="w-full bg-transparent border rounded-lg border-gray-400 text-white px-2 py-2 over-flow-hidden focus:outline-none hidden md:block" placeholder="Find something here..."/>

            <Search className='absolute md:right-1 lg hidden md:block'/>

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
