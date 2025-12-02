"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock,
  ChefHat,
  Package,
  AlertCircle,
  CheckCircle2,
  Timer,
  User,
  Phone,
  MapPin,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { useRestaurantSocket } from "@/lib/socket/client"

interface KitchenDisplaySystemProps {
  restaurantId: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  createdAt: string
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  specialInstructions?: string
  total: number
  items: Array<{
    id: string
    quantity: number
    price: number
    subtotal: number
    specialInstructions?: string
    menuItem: {
      id: string
      name: string
      image?: string[]
    }
    modifiers?: Array<{
      id: string
      name: string
      price: number
    }>
  }>
}

export function KitchenDisplaySystem({ restaurantId }: KitchenDisplaySystemProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  // Use Socket.io for real-time updates
  const { socket, isConnected } = useRestaurantSocket(restaurantId)

  useEffect(() => {
    fetchOrders()
    // Fallback polling every 10 seconds if Socket.io is not connected
    const interval = setInterval(() => {
      if (!isConnected) {
        fetchOrders()
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [restaurantId, isConnected])

  // Listen to Socket.io events
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleOrderUpdate = (data: any) => {
      if (data.order) {
        setOrders((prev) => {
          const index = prev.findIndex((o) => o.id === data.order.id)
          if (index >= 0) {
            // Update existing order
            const updated = prev.map((o) => (o.id === data.order.id ? data.order : o))
            // Re-sort by status and time
            return updated.sort((a, b) => {
              const statusPriority: Record<string, number> = {
                PENDING: 1,
                PREPARING: 2,
                READY: 3,
              }
              const priorityDiff = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99)
              if (priorityDiff !== 0) return priorityDiff
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            })
          } else {
            // Add new order if it's active
            if (data.order.status === "PENDING" || data.order.status === "PREPARING" || data.order.status === "READY") {
              return [data.order, ...prev].sort((a, b) => {
                const statusPriority: Record<string, number> = {
                  PENDING: 1,
                  PREPARING: 2,
                  READY: 3,
                }
                const priorityDiff = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99)
                if (priorityDiff !== 0) return priorityDiff
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              })
            }
            return prev
          }
        })
      }
    }

    const handleOrderCreated = (data: any) => {
      if (data.order) {
        setOrders((prev) => {
          // Check if order already exists
          if (prev.find((o) => o.id === data.order.id)) {
            return prev
          }
          // Only add if it's an active order
          if (data.order.status === "PENDING" || data.order.status === "PREPARING" || data.order.status === "READY") {
            return [data.order, ...prev].sort((a, b) => {
              const statusPriority: Record<string, number> = {
                PENDING: 1,
                PREPARING: 2,
                READY: 3,
              }
              const priorityDiff = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99)
              if (priorityDiff !== 0) return priorityDiff
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            })
          }
          return prev
        })
      }
    }

    socket.on("order:updated", handleOrderUpdate)
    socket.on("order:created", handleOrderCreated)

    return () => {
      socket.off("order:updated", handleOrderUpdate)
      socket.off("order:created", handleOrderCreated)
    }
  }, [socket, isConnected])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?restaurantId=${restaurantId}`)
      const data = await response.json()
      
      // Filter to only show active orders (PENDING, PREPARING, READY)
      const activeOrders = (data.orders || []).filter(
        (order: Order) => 
          order.status === "PENDING" || 
          order.status === "PREPARING" || 
          order.status === "READY"
      )
      
      // Sort by status priority and time
      activeOrders.sort((a: Order, b: Order) => {
        const statusPriority: Record<string, number> = {
          PENDING: 1,
          PREPARING: 2,
          READY: 3,
        }
        const priorityDiff = statusPriority[a.status] - statusPriority[b.status]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
      
      setOrders(activeOrders)
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
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }


  const getTimeElapsed = (createdAt: string) => {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: false })
    } catch {
      return "Just now"
    }
  }

  const getTimeAlert = (createdAt: string, status: string) => {
    const minutesElapsed = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / 60000
    )
    
    if (status === "PENDING" && minutesElapsed > 5) {
      return "urgent"
    }
    if (status === "PREPARING" && minutesElapsed > 15) {
      return "warning"
    }
    return "normal"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading kitchen orders...</p>
        </div>
      </div>
    )
  }

  const pendingOrders = orders.filter((o) => o.status === "PENDING")
  const preparingOrders = orders.filter((o) => o.status === "PREPARING")
  const readyOrders = orders.filter((o) => o.status === "READY")

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Kitchen Display</h1>
        <p className="text-gray-400">Real-time order queue for kitchen staff</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">New Orders</p>
                <p className="text-3xl font-bold text-yellow-400">{pendingOrders.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Preparing</p>
                <p className="text-3xl font-bold text-blue-400">{preparingOrders.length}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ready</p>
                <p className="text-3xl font-bold text-green-400">{readyOrders.length}</p>
              </div>
              <Package className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {orders.map((order, index) => {
            const statusConfig = getStatusConfigForOrder(order.status)
            const StatusIcon = statusConfig.icon
            const timeAlert = getTimeAlert(order.createdAt, order.status)
            const isUrgent = timeAlert === "urgent"
            const isWarning = timeAlert === "warning"

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow cursor-pointer transition-all hover:border-cyan-500/50 ${
                    isUrgent ? "ring-2 ring-red-500/50 animate-pulse" : ""
                  } ${isWarning ? "ring-2 ring-yellow-500/50" : ""}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white">
                            #{order.orderNumber}
                          </h3>
                          {isUrgent && (
                            <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Timer className="h-4 w-4" />
                          <span>{getTimeElapsed(order.createdAt)} ago</span>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 ${statusConfig.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Customer Info */}
                    {order.customerName && (
                      <div className="mb-4 p-3 bg-[#0D0D0D] rounded-[12px] space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <User className="h-4 w-4 text-gray-500" />
                          {order.customerName}
                        </div>
                        {order.customerPhone && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Phone className="h-4 w-4 text-gray-500" />
                            {order.customerPhone}
                          </div>
                        )}
                        {order.customerAddress && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="truncate">{order.customerAddress}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="mb-4 space-y-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-300">
                            {item.quantity}x {item.menuItem.name}
                          </span>
                          {item.modifiers && item.modifiers.length > 0 && (
                            <span className="text-xs text-gray-500">
                              +{item.modifiers.length} mods
                            </span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>

                    {/* Special Instructions */}
                    {order.specialInstructions && (
                      <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-[12px]">
                        <p className="text-xs font-semibold text-yellow-400 mb-1">
                          Special Instructions:
                        </p>
                        <p className="text-sm text-gray-300">{order.specialInstructions}</p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-[#2A2A2A]">
                      <span className="text-sm text-gray-400">Total</span>
                      <span className="text-lg font-bold text-cyan-400">
                        {formatCurrency(Number(order.total))}
                      </span>
                    </div>

                    {/* Action Button */}
                    {statusConfig.nextStatus && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          updateOrderStatus(order.id, statusConfig.nextStatus!)
                        }}
                        className={`w-full ${
                          order.status === "PENDING"
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : order.status === "PREPARING"
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {statusConfig.nextLabel}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {orders.length === 0 && (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Orders</h3>
            <p className="text-gray-400">All orders have been completed!</p>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(newStatus) => {
            updateOrderStatus(selectedOrder.id, newStatus)
          }}
        />
      )}
    </div>
  )
}

function OrderDetailModal({
  order,
  onClose,
  onStatusUpdate,
}: {
  order: Order
  onClose: () => void
  onStatusUpdate: (status: string) => void
}) {
  const statusConfig = getStatusConfigForOrder(order.status)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[22px] shadow-glow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Order #{order.orderNumber}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400">
              ×
            </Button>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <Card key={item.id} className="bg-[#0D0D0D] border-[#2A2A2A]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">
                        {item.quantity}x {item.menuItem.name}
                      </h4>
                      {item.specialInstructions && (
                        <p className="text-sm text-yellow-400 mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <span className="text-cyan-400 font-semibold">
                      {formatCurrency(Number(item.subtotal))}
                    </span>
                  </div>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {item.modifiers.map((modifier) => (
                        <div
                          key={modifier.id}
                          className="text-sm text-gray-400 flex items-center gap-2"
                        >
                          <span className="text-cyan-400">+</span>
                          {modifier.name}
                          {modifier.price > 0 && (
                            <span className="text-gray-500">
                              ({formatCurrency(Number(modifier.price))})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customer Info */}
          {(order.customerName || order.customerPhone || order.customerAddress) && (
            <Card className="bg-[#0D0D0D] border-[#2A2A2A] mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-3">Customer Details</h3>
                <div className="space-y-2 text-sm">
                  {order.customerName && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="h-4 w-4 text-gray-500" />
                      {order.customerName}
                    </div>
                  )}
                  {order.customerPhone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {order.customerPhone}
                    </div>
                  )}
                  {order.customerAddress && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {order.customerAddress}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special Instructions */}
          {order.specialInstructions && (
            <Card className="bg-yellow-500/10 border-yellow-500/30 mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-yellow-400 mb-2">Special Instructions</h3>
                <p className="text-gray-300">{order.specialInstructions}</p>
              </CardContent>
            </Card>
          )}

          {/* Total */}
          <div className="flex items-center justify-between mb-6 p-4 bg-[#0D0D0D] rounded-[12px]">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-bold text-cyan-400">
              {formatCurrency(Number(order.total))}
            </span>
          </div>

          {/* Action Buttons */}
          {statusConfig.nextStatus && (
            <Button
              onClick={() => {
                onStatusUpdate(statusConfig.nextStatus!)
                onClose()
              }}
              className={`w-full h-12 text-lg ${
                order.status === "PENDING"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : order.status === "PREPARING"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {statusConfig.nextLabel}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function getStatusConfigForOrder(status: string) {
  switch (status) {
    case "PENDING":
      return {
        label: "New Order",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
        icon: Clock,
        nextStatus: "PREPARING",
        nextLabel: "Start Preparing",
      }
    case "PREPARING":
      return {
        label: "Preparing",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/50",
        icon: ChefHat,
        nextStatus: "READY",
        nextLabel: "Mark Ready",
      }
    case "READY":
      return {
        label: "Ready",
        color: "bg-green-500/20 text-green-400 border-green-500/50",
        icon: Package,
        nextStatus: "COMPLETED",
        nextLabel: "Complete Order",
      }
    default:
      return {
        label: status,
        color: "bg-gray-500/20 text-gray-400 border-gray-500/50",
        icon: Clock,
        nextStatus: null,
        nextLabel: null,
      }
  }
}

