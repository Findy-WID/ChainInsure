'use client'

import { Shield, Zap, Lock, Coins } from 'lucide-react'
import React from 'react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CircleArrowRight } from 'lucide-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import Image from 'next/image'
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";

const features = [
  {
    icon: Shield, // Icon component
    title: 'Comprehensive Coverage',
    description: 'Protect your digital assets against hacks, theft, and other risks.',
  },
  {
    icon: Zap, // Icon component
    title: 'Instant Claims',
    description: 'Get your claims processed quickly with our automated smart contracts.',
  },
  {
    icon: Lock, // Icon component
    title: 'Decentralized Security',
    description: 'Leverage the power of blockchain for unparalleled security and transparency.',
  },
  {
    icon: Coins, // Icon component
    title: 'Flexible Plans',
    description: 'Choose from a variety of coverage options tailored to your needs.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Chain Insure?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon // Extracting the icon as a component
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <Icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      <article className="container w-5/6 mx-auto">

        {/*first container */}
        <div className="flex flex-col md:flex-row mb-6 justify-between space-x-4">

          {/*cta feature */}
          <div className='bg-[#0B0C16] py-20 px-6 rounded-xl shadow-md w-2/5 transition duration-300 ease-in-out transform hover:scale-105'>
            <h1 className="text-white tracking-wide leading-loose text-2xl font-sans font-bold mb-4">
              Get insured against hacks, wallet draining and malicious activities
            </h1>
            
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
            </Wallet>

          </div>

          {/*assets feature */}
          <div className='bg-white flex space-x-8 items-center p-6 rounded-xl shadow-md w-3/5 transition duration-300 ease-in-out transform hover:scale-105'>
            <Image 
              src="/images/assets.svg" 
              alt="assets-image" 
              height={150}
              width={120}
              className='h-36 w-28'
            />
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#302B63] tracking-wide mb-4">
                Secure your assets
              </h1>
              <p className="text-gray-600">
                Chain Insure continuously monitors your assets for unauthorized access and suspicious activities.
              </p>
            </div>
          </div>

        </div>
      </article>
    </section>
  )
}
