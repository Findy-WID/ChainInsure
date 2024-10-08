import { Shield, Zap, Lock, Coins } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Comprehensive Coverage',
    description: 'Protect your digital assets against hacks, theft, and other risks.',
  },
  {
    icon: Zap,
    title: 'Instant Claims',
    description: 'Get your claims processed quickly with our automated smart contracts.',
  },
  {
    icon: Lock,
    title: 'Decentralized Security',
    description: 'Leverage the power of blockchain for unparalleled security and transparency.',
  },
  {
    icon: Coins,
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
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}