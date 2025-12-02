"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Phone, MapPin, Eye } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

interface OrdersListProps {
  restaurantId: string
  status: string | null
}

export function OrdersList({ restaurantId, status }: OrdersListProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    // Refresh every 10 seconds for real-time updates
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PREPARING":
        return "bg-blue-100 text-blue-800"
      case "READY":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-gray-100 text-gray-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "PENDING":
        return "PREPARING"
      case "PREPARING":
        return "READY"
      case "READY":
        return "COMPLETED"
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const nextStatus = getNextStatus(order.status)
        return (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      Order #{order.orderNumber}
                    </h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      {order.customerName && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{order.customerName}</span>
                        </div>
                      )}
                      {order.customerPhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{order.customerPhone}</span>
                        </div>
                      )}
                      {order.table && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>Table {order.table.number}</span>
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Items: </span>
                        <span className="font-medium">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(Number(order.total))}
                      </div>
                    </div>
                  </div>

                  {order.specialInstructions && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <strong>Note:</strong> {order.specialInstructions}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  {nextStatus && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, nextStatus)}
                    >
                      Mark as {nextStatus}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

