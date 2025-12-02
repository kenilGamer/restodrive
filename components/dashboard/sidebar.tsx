"use client"

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
  ChefHat,
  Users,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Menu Builder", href: "/dashboard/menu", icon: UtensilsCrossed },
  { name: "QR Menus", href: "/dashboard/qr", icon: QrCode },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Kitchen", href: "/dashboard/kitchen", icon: ChefHat },
  { name: "Staff", href: "/dashboard/staff", icon: Users },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "POS", href: "/dashboard/pos", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#0D0D0D] border-r border-[#2A2A2A] px-6 pb-4">
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center border-b border-[#2A2A2A] mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#11C97A] to-[#C97AFF] flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              RestoDrive
            </h1>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            <li>
              <ul role="list" className="space-y-1">
                {navigation.map((item, index) => {
                  // Special handling for Dashboard - only active on exact match
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex gap-x-3 rounded-lg px-3 py-2.5 text-sm leading-6 font-medium transition-all duration-200",
                          isActive
                            ? "bg-[#FCD34D] text-[#0D0D0D] shadow-lg shadow-[#FCD34D]/20"
                            : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0 transition-transform duration-200",
                            isActive
                              ? "text-[#0D0D0D]"
                              : "text-gray-500 group-hover:text-white"
                          )}
                          aria-hidden="true"
                        />
                        <span className={cn("transition-colors", isActive && "font-semibold")}>
                          {item.name}
                        </span>
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </li>
            <li className="mt-auto pt-4 border-t border-[#2A2A2A]">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="group -mx-2 flex w-full gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium leading-6 text-gray-400 hover:bg-[#1A1A1A] hover:text-red-400 transition-all duration-200"
              >
                <LogOut
                  className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-red-400 transition-colors"
                  aria-hidden="true"
                />
                Sign out
              </motion.button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
