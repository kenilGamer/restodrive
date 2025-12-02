"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Phone, Mail, MapPin, Clock, CreditCard } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

interface OrderDetailViewProps {
  order: any
}

export function OrderDetailView({ order: initialOrder }: OrderDetailViewProps) {
  const router = useRouter()
  const [order, setOrder] = useState(initialOrder)
  const [updating, setUpdating] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      }
    } catch (error) {
      console.error("Error updating order:", error)
    } finally {
      setUpdating(false)
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

  const nextStatus = getNextStatus(order.status)

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Created {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            {nextStatus && (
              <Button
                onClick={() => updateStatus(nextStatus)}
                disabled={updating}
              >
                Mark as {nextStatus}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>
              {order.items.length} item(s) in this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {item.menuItem.image &&
                        item.menuItem.image.length > 0 && (
                          <img
                            src={item.menuItem.image[0]}
                            alt={item.menuItem.name}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                        )}
                      <div>
                        <h3 className="font-semibold">{item.menuItem.name}</h3>
                        {item.variant && (
                          <p className="text-sm text-gray-500">
                            {item.variant.name}
                          </p>
                        )}
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="mt-1">
                            {item.modifiers.map((mod: any) => (
                              <span
                                key={mod.id}
                                className="text-xs text-gray-500 mr-2"
                              >
                                + {mod.modifier.name}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-semibold">
                      {formatCurrency(Number(item.subtotal))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.customerName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{order.customerName}</span>
                </div>
              )}
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
              {order.customerEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{order.customerEmail}</span>
                </div>
              )}
              {order.table && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Table {order.table.number}</span>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{order.deliveryAddress}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(Number(order.subtotal))}</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(Number(order.tax))}</span>
                  </div>
                )}
                {order.serviceCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge</span>
                    <span>{formatCurrency(Number(order.serviceCharge))}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(Number(order.total))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          {order.payment && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span>Status: {order.payment.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Method:</span>
                    <span>{order.payment.method}</span>
                  </div>
                  {order.payment.transactionId && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm">
                        {order.payment.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special Instructions */}
          {order.specialInstructions && (
            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.specialInstructions}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

