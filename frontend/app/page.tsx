import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import { Info } from '@/components/Info'
import { Faqs } from '../components/Faqs'



export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <Info/>
        <Faqs/>
      </main>
      <Footer />
    </div>
  )
}