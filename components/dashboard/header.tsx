"use client"

import { useSession } from "next-auth/react"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-3"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-full max-w-lg"
          />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </Button>
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
          <div className="flex items-center gap-x-2">
            <div className="hidden lg:flex lg:flex-col lg:items-end">
              <p className="text-sm font-semibold text-gray-900">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

