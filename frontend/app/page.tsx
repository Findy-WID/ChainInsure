import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
// import { Cta } from '@/components/Cta'
import SwapComponents from '@/components/features/page'
import FramePage from '@/components/Frame'


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        {/* <Features /> */}
        <SwapComponents />
        {/* <Cta/> */}
        <FramePage />
      </main>
      <Footer />
    </div>
  )
}