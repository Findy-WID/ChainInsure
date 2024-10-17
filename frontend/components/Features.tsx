'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CircleArrowRight } from 'lucide-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import Image from 'next/image'



export function Features() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <section id="features" className="py-20 bg-gray-100">
      <article className="container w-5/6 mx-auto">

        {/*first container */}
        <div className="flex flex-col md:flex-row mb-6 justify-between md:space-x-4 space-y-6 md:space-y-0">

          {/*cta feature */}
          <div className='bg-[#0B0C16] py-5 md:py-20 px-6 rounded-xl shadow-md md:w-2/5 transition duration-300 ease-in-out transform hover:scale-105'>
            <h1 className="text-white tracking-wide leading-loose text-2xl font-sans font-bold mb-4 ">Get insured against hacks, wallet draining and malicious activities</h1>
            
            {isConnected ? (
            <Button className = 'bg-white text-black rounded-full transition duration-300 ease-in-out transform hover:scale-105' onClick={() => disconnect()}><Image src="/images/arrow-right-filled.svg" alt="arrow right" 
            height={32}
            width={32}
            className='h-8 w-8 mr-2'/>Disconnect</Button>
            ) : (
            <Button className = 'bg-white text-black rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-400' onClick={() => connect({ connector: connectors[0] })}><Image src="/images/arrow-right-filled.svg" alt="arrow right" 
            height={32}
            width={32}
            className='h-8 w-8 mr-2'/>Connect wallet</Button>
            )}

          </div>

          {/*assets feature */}
          <div className='bg-white flex flex-col md:flex-row md:space-x-8 items-center p-6 rounded-xl shadow-md w-full md:w-3/5 transition duration-300 ease-in-out transform hover:scale-105'>
            <Image src="/images/assets.svg" alt="assets-image" 
            height={150}
            width={120}
            className='h-28 w-full mb-2 md:mb-0 md:h-36 md:w-28'/>
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#302B63] tracking wide mb-4">Secure your assets</h1>
              <p className="text-gray-600">
              Chain Insure continuously monitors your assets for unauthorized access and suspicious activities.
              </p>
            </div>
          </div>
        </div>
        
        {/*second container */}
        <div className='flex flex-col md:flex-row mb-2 justify-between space-y-6 md:space-y-0 md:space-x-4 '>

          {/*vaults feature */}
          <div className='flex flex-row bg-white px-6 py-5 md:py-20 rounded-lg shadow-md w-full md:w-3/5 md:relative transition duration-300 ease-in-out transform hover:scale-105'>
              <div className='md:w-3/5 pt-20 md:absolute bottom-20'>
                <h1 className="text-2xl font-bold font-serif text-[#302B63] tracking wide mb-4">Manage your vault</h1>
                <p className="text-gray-600">
                Create a vault and safe guard your assets with real time information and notifications.
                </p>
              </div>

              <Image src='/images/vault.svg' alt='vault-image' height={250}
              width={424}
              className='w-6/12 z-2 pb-8 absolute top-0 right-0'/>
            </div>

            {/*Pools feature */}
            <div className='flex flex-col px-6 py-5 md:py-20 space-y-6 md:space-y-10 bg-white rounded-lg shadow-md md:w-2/5 transition duration-300 ease-in-out transform hover:scale-105'>
                <Image src='/images/pool.svg'  alt='pool-image' height={96}
                width={150}
                className='w-full h-32 md:h-20 md:w-32'/>


                <div>
                    <h1 className="text-2xl font-bold font-serif text-[#302B63] tracking wide mb-2">ETH/USDT staking pool</h1>
                    <p className="text-gray-600">
                    Stake your funds in Chain Insure's pool and earn
                    interest with competitive rates.
                    </p>
                </div>
                
            </div>
        </div>

          


        
      </article>
    </section>
  )
}

