import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle, Clock, XCircle, Package } from "lucide-react"

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(customerAuthOptions)

  if (!session?.user?.id) {
    redirect("/customer/login")
  }

  const { id } = await params

  const order = await db.order.findUnique({
    where: { id },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          phone: true,
          email: true,
        },
      },
      items: {
        include: {
          menuItem: {
            include: {
              category: true,
            },
          },
          variant: true,
          modifiers: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  if (!order) {
    notFound()
  }

  if (order.customerId !== session.user.id) {
    redirect("/customer/orders")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
        <p className="text-gray-500 mt-2">{formatDate(order.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b pb-4">
                    <div className="flex-1">
                      <div className="font-medium">{item.menuItem.name}</div>
                      {item.variant && (
                        <div className="text-sm text-gray-500">{item.variant.name}</div>
                      )}
                      {item.modifiers.length > 0 && (
                        <div className="text-sm text-gray-500">
                          {item.modifiers.map((mod) => mod.name).join(", ")}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(Number(item.subtotal))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <Badge variant="outline" className="text-lg">
                  {order.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(Number(order.tax))}</span>
              </div>
              {Number(order.serviceCharge) > 0 && (
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>{formatCurrency(Number(order.serviceCharge))}</span>
                </div>
              )}
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(Number(order.discount))}</span>
                </div>
              )}
              {order.loyaltyPointsRedeemed > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Points Redeemed</span>
                  <span>{order.loyaltyPointsRedeemed} pts</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(Number(order.total))}</span>
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">{order.restaurant.name}</div>
                {order.restaurant.phone && (
                  <div className="text-sm text-gray-500">{order.restaurant.phone}</div>
                )}
                {order.restaurant.email && (
                  <div className="text-sm text-gray-500">{order.restaurant.email}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

