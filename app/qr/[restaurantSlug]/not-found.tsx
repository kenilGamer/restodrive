import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border border-red-500/30 mb-8">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-orbitron font-black mb-6">
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            404
          </span>
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
          Menu Not Found
        </h2>
        
        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
          The restaurant menu you're looking for doesn't exist or isn't available yet.
          <br />
          Please check the URL or contact the restaurant.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-white/20 hover:border-cyan-500/50 hover:text-cyan-400 bg-black/50 backdrop-blur-sm"
          >
            <Link href="/dashboard">
              <Search className="mr-2 h-5 w-5" />
              Find Restaurant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

