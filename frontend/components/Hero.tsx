'use client'

import { useAccount, useConnect } from 'wagmi'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Marquee from './Marquee'

export function Hero() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  return (
    <section className="relative">
       <div className="absolute inset-0 -z-50 h-[800px]" >
        <Image
          src="/images/Main.png" 
          alt="Background Image" 
          layout="fill" 
          objectFit="cover" 
          className="-z-50 h-[800px]"
        />
      </div>
      <div className="container py-40 z-10 mx-auto px-4 text-center">
        <h1 className="text-white text-5xl font-bold mb-6">Enjoy real time wallet monitoring,
        and hassle free protection.</h1>
        <p className="text-white text-xl mb-8">Create a vault that protects your assets from malicious hacks
        and easily stake your assets in ETH/USDT pools for guaranteed rewards.</p>
        {/* {!isConnected && (
          <Button 
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transition duration-300"
          >
            Get Started
          </Button>
        )} */}

        
      </div>
      <div>
      <Marquee/>
      <Marquee/>
      </div>
    </section>
  )
}