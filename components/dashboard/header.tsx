"use client"

import { useSession } from "next-auth/react"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { MobileSidebar } from "./mobile-sidebar"

export function DashboardHeader() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-[#2A2A2A] bg-[#1A1A1A] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          {/* Welcome Message */}
          <div className="hidden lg:flex items-center">
            <p className="text-sm font-medium text-white">
              Welcome, {session?.user?.name || "User"} 👋
            </p>
          </div>

          {/* Search */}
          <div className="relative flex flex-1 items-center max-w-xl">
            <Search
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500 pl-3"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Q Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-[#0D0D0D] border-[#2A2A2A] text-white placeholder:text-gray-500 focus:border-[#FCD34D] focus:ring-[#FCD34D]"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-3 lg:gap-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A55] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A55]"></span>
              </span>
              <span className="sr-only">View notifications</span>
            </Button>

            {/* Divider */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[#2A2A2A]" />

            {/* User Profile */}
            <div className="flex items-center gap-x-3">
              <div className="hidden lg:flex lg:flex-col lg:items-end">
                <p className="text-sm font-semibold text-white">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#11C97A] to-[#C97AFF] flex items-center justify-center text-white font-semibold text-sm shadow-glow cursor-pointer hover:shadow-glow-lg transition-shadow">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
