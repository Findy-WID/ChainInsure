'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from "@/components/ui/button"

export function Header() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-serif font-bold">Chain Insure</span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
          <Link href="#contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        </nav>
        {isConnected ? (
          <Button onClick={() => disconnect()}>Disconnect</Button>
        ) : (
          <Button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</Button>
        )}
      </div>
    </header>
  )
}