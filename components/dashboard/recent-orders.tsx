"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowRight, Clock, CheckCircle, XCircle, Package } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  customerName: string | null
  createdAt: string
  type: string
}

interface RecentOrdersProps {
  restaurantId: string
  limit?: number
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: CheckCircle },
  PREPARING: { label: "Preparing", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Package },
  READY: { label: "Ready", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  DELIVERED: { label: "Delivered", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  COMPLETED: { label: "Completed", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
}

export function RecentOrders({ restaurantId, limit = 5 }: RecentOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?restaurantId=${restaurantId}&limit=${limit}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId) {
      fetchOrders()
    }
  }, [restaurantId, limit])

  if (loading) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
          <CardDescription className="text-gray-400">Latest orders from your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-[#2A2A2A]">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#2A2A2A] rounded w-1/4"></div>
                  <div className="h-3 bg-[#2A2A2A] rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-[#2A2A2A] rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
          <CardDescription className="text-gray-400">Latest orders from your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-gray-400">
            No orders yet. Orders will appear here once customers start placing orders.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg font-semibold text-white">Recent Orders</CardTitle>
          <CardDescription className="text-gray-400">Latest orders from your restaurant</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]">
          <Link href="/dashboard/orders">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.PENDING
            const StatusIcon = statusInfo.icon

            return (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block group"
              >
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#2A2A2A] hover:border-[#FCD34D]/30 hover:bg-[#2A2A2A]/50 transition-all cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white group-hover:text-[#FCD34D] transition-colors">
                        {order.orderNumber}
                      </p>
                      <Badge className={`${statusInfo.color} text-xs border`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{order.customerName || "Guest"}</span>
                      <span>•</span>
                      <span>{formatDate(order.createdAt)}</span>
                      <span>•</span>
                      <span className="capitalize">{order.type.toLowerCase().replace("_", " ")}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(Number(order.total))}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
