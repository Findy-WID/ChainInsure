import { ShieldCheck } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <ShieldCheck className="h-8 w-8 text-blue-400 mr-2" />
            <span className="text-2xl font-serif font-bold">Chain Insure</span>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-6">
            <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400">Terms of Service</a>
            <a href="#" className="hover:text-blue-400">Contact Us</a>
          </nav>
        </div>
        <div className="mt-8 text-center text-gray-400">
          © {new Date().getFullYear()} Chain Insure. All rights reserved.
        </div>
      </div>
    </footer>
  )
}