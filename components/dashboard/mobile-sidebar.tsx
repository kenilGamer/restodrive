"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  ShoppingCart,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Menu Builder", href: "/dashboard/menu", icon: UtensilsCrossed },
  { name: "QR Menus", href: "/dashboard/qr", icon: QrCode },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "POS", href: "/dashboard/pos", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0D0D0D] border-r border-[#2A2A2A] lg:hidden">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#11C97A] to-[#C97AFF] flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">RestoDrive</h1>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:bg-[#1A1A1A] hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#FCD34D] text-[#0D0D0D]"
                          : "text-gray-400 hover:bg-[#1A1A1A] hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-[#0D0D0D]" : "text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-[#2A2A2A] p-4">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="flex w-full gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-[#1A1A1A] hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0 text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
