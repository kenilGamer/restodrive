"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Phone, MapPin, Eye, CheckCircle2, ChefHat, Package, Truck, XCircle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface PremiumOrdersListProps {
  restaurantId: string
  status: string | null
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Clock,
    nextStatus: "PREPARING",
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: ChefHat,
    nextStatus: "READY",
  },
  READY: {
    label: "Ready",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: Package,
    nextStatus: "DELIVERED",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: Truck,
    nextStatus: "COMPLETED",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    icon: CheckCircle2,
    nextStatus: null,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
    nextStatus: null,
  },
}

export function PremiumOrdersList({ restaurantId, status }: PremiumOrdersListProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [restaurantId, status])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({ restaurantId })
      if (status) {
        params.append("status", status)
      }

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-[#2A2A2A] rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-[#2A2A2A] rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No orders found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {orders.map((order, index) => {
          const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING
          const StatusIcon = statusInfo.icon
          const timelineSteps = [
            { status: "PENDING", label: "Order Placed", icon: Clock },
            { status: "PREPARING", label: "Preparing", icon: ChefHat },
            { status: "READY", label: "Ready", icon: Package },
            { status: "DELIVERED", label: "Delivered", icon: Truck },
            { status: "COMPLETED", label: "Completed", icon: CheckCircle2 },
          ]

          const currentStepIndex = timelineSteps.findIndex((step) => step.status === order.status)

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow hover:shadow-glow-lg transition-all duration-200 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{order.orderNumber}</h3>
                        <Badge className={`${statusInfo.color} border text-xs font-medium flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {order.customerName || "Guest"}
                        </div>
                        {order.customerPhone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {order.customerPhone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white mb-1">
                        {formatCurrency(Number(order.total))}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {order.type?.toLowerCase().replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="mb-4 pt-4 border-t border-[#2A2A2A]">
                    <div className="flex items-center justify-between">
                      {timelineSteps.map((step, idx) => {
                        const StepIcon = step.icon
                        const isCompleted = idx <= currentStepIndex
                        const isCurrent = idx === currentStepIndex

                        return (
                          <div key={step.status} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted
                                    ? "bg-[#11C97A] border-[#11C97A] text-white"
                                    : isCurrent
                                    ? "bg-[#C97AFF] border-[#C97AFF] text-white"
                                    : "bg-[#2A2A2A] border-[#2A2A2A] text-gray-600"
                                }`}
                              >
                                <StepIcon className="h-4 w-4" />
                              </div>
                              <p
                                className={`text-xs mt-2 text-center ${
                                  isCompleted || isCurrent ? "text-white" : "text-gray-500"
                                }`}
                              >
                                {step.label}
                              </p>
                            </div>
                            {idx < timelineSteps.length - 1 && (
                              <div
                                className={`h-0.5 flex-1 mx-2 ${
                                  isCompleted ? "bg-[#11C97A]" : "bg-[#2A2A2A]"
                                }`}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-4 pt-4 border-t border-[#2A2A2A]">
                      <p className="text-xs text-gray-400 mb-2">Items ({order.items.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item: any) => (
                          <span
                            key={item.id}
                            className="px-2 py-1 text-xs rounded-full bg-[#2A2A2A] text-gray-400"
                          >
                            {item.quantity}x {item.menuItem?.name || "Item"}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-[#2A2A2A] text-gray-400">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#2A2A2A]">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-1 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                    >
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    {statusInfo.nextStatus && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, statusInfo.nextStatus!)}
                        className="flex-1 bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0"
                      >
                        Mark as {statusConfig[statusInfo.nextStatus as keyof typeof statusConfig]?.label}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

