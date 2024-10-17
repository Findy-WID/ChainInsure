import React from 'react'

export function Info() {
  return (
    <section className='bg-[#0C0E1A] py-10 md:py-20'>
        <div className='w-full md:w-3/5 mx-auto flex flex-col items-center justify-center text-center space-y-4'>
            <div className="flex flex-row items-center space-x-2 justify-center rounded-full bg-[#5156BD] w-5/6 md:w-2/5 h-8 mx-auto">
              <span className="text-white">•</span><p className='text-white text-sm'>Insure your assets, Grow your wealth</p>
            </div>

            <h1 className='text-2xl md:text-3xl lg:4xl font-bold font-serif tracking-wide leading-relaxed text-white'>Secure Your Digital Assets with Blockchain-Powered Protection</h1>

            <p className="tracking-wide text-sm text-gray-100 text-center w-5/6 leading-relaxed">Chain Insure safeguards your crypto assets from malicious attacks and provides
            staking opportunities in the ETH/USDT pool to earn rewards.</p>
        </div>
    </section>
  )
}

