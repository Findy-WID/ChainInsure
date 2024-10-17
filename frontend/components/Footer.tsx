
import Image from "next/image"

const icons = [
  {icon:'github', src:'/images/github.svg'},
  {icon:'discord', src:'/images/discord.svg'},
  {icon:'telegram', src:'/images/telegram.svg'},
  {icon:'twitter', src:'/images/twitter.svg'}
]

export function Footer () {
  return (
    <footer className="bg-[#0C0E1A] text-white pt-12">
      <div className="flex flex-col md:flex-row space-y-6 justify-between mx-auto px-8">
        <div className="flex flex-col space-y-4 ">
          <h1 className="text-3xl">Chain Insure</h1>
          <p className="text-sm w-full md:w-2/5 text-[#ACACB8]">
          A base platform providing onchain insurance for digital assets against wallet hacks and staking on ETH/USDT  liquidity pools to earn high APY
          </p>
        </div>

        <nav className="flex justify-between md:space-x-10">
          <div className='flex flex-col space-y-2'>
            <h1 className="text-xl">Company</h1>
            <a href="#" className="text-[#ACACB8] hover:text-blue-400">Documentation</a>
            <a href="#" className="text-[#ACACB8] hover:text-blue-400">Blog</a>
            <a href="#" className="text-[#ACACB8] hover:text-blue-400">About us</a>

          </div>
          <div className='flex text-nowrap flex-col space-y-2'>
            <h1 className="text-xl">Legal</h1>
            <a href="#" className="text-[#ACACB8] whitespace-nowrap hover:text-blue-400">Privacy policy</a>
            <a href="#" className="text-[#ACACB8] hover:text-blue-400">Terms of use</a>
            

          </div>

          <div className='flex flex-col space-y-2'>
            <h1 className="text-xl">Support</h1>
            <a href="#" className="text-[#ACACB8] whitespace-nowrap hover:text-blue-400">Help center</a>
            <a href="#" className="text-[#ACACB8] hover:text-blue-400">Contact us</a>
            

          </div>
        </nav>
      </div>
      <div className='flex flex-col-reverse space-y-4 md:space-y-0 md:flex-row justify-between items-center mx-auto px-8 mt-16 border-b border-1 border-[#4D4F6F] pb-6'>
        <p className="text-sm text-left text-[#ACACB8] mt-6">Copyright 2024 ChainInsure All Rights Reserved</p>

        <div className="flex flex-row space-x-4 text-right">
          {icons.map((icon, index)=>{
            return <a href="#" key={index}className="group">
              <div className="transition-opacity duration-300 group-hover:opacity-75"><Image src={icon.src} alt={icon.icon} height={24} width={24}/></div>
              </a>
          })}
        </div>
      </div>

      <div className="h-32 w-full mt-16 bg-center bg-[url('/images/chain-insure.svg')]"></div>
    </footer>
  )
}