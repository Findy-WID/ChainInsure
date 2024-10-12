import React from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'


export function DashboardTopbar() {
  return (
    <div className='flex justify-between items-center p-4 text-white bg-[#0C0E1A]'>
        <div className="flex items-center w-full max-w-lg relative">
            <input type="text" name="search" id="search" className="w-full bg-transparent border rounded-lg border-gray-400 text-white px-10 py-2 focus:outline-none " placeholder="Find something here..."/>

            <Search className='absolute right-4'/>

        </div>

        <div className="flex items-center space-x-4">
            <Image src='/images/avatar.png' alt='avatar' width={60} height={60} className='rounded-full h-10 w-10'/>

            <span>0xcec2...658e</span>
        </div>
    </div>
  )
}
