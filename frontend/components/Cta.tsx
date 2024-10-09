'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CircleArrowRight } from 'lucide-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import Image from 'next/image'

export function Cta() {
    const { isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()

  return (
    <section id='cta' className='bg-gray-100 py-20'>
        <div className="container w-4/5 mx-auto">
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-[#0B0C16] py-10 px-5 rounded-lg shadow-md'>

            <h4 className="text-white text-xl font-bold mb-4">Get insured against hacks, wallet draining and malicious activities</h4>
           
            {isConnected ? (
            <Button className = 'bg-white text-black rounded-full' onClick={() => disconnect()}><CircleArrowRight size={28} strokeWidth={1} />Disconnect</Button>
            ) : (
            <Button className = 'bg-white text-black rounded-full' onClick={() => connect({ connector: connectors[0] })}><CircleArrowRight size={28} strokeWidth={1} className='mr-2 color-[#0B0C16]'/>Connect wallet</Button>
            )}

            </div>

            <div className='md:col-span-2 flex flex-row space-x-8 items-center bg-white p-6 rounded-lg shadow-md '>
                <Image src="/images/assets.svg" alt="assets-image" 
                height={150}
                width={120}
                className='h-36 w-28'

                />
                <div>
                <h1 className="text-3xl font-bold font-serif text-[#302B63] tracking wide mb-4">Secure your assets</h1>
                <p className="text-gray-600">
                Chain Insure continuously monitors your assets for unauthorized access and suspicious activities.
                </p>
                </div>
            </div>

            <div className='md:col-span-2 flex flex-row bg-white p-6 rounded-lg shadow-md'>
                <div>
                <h1 className="text-3xl font-bold font-serif text-[#302B63] tracking wide mb-4">Manage your vault</h1>
                <p className="text-gray-600">
                Create a vault and safe guard your assets with real time information and notifications.
                </p>
                </div>

                <Image src='/images/vault.svg' alt='vault-image' height={250}
                width={424}
                className='h-36 w-60'/>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'></div>

        </div>
        </div>
    </section>
  )
}


