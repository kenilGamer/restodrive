import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoyaltyDashboard } from "@/components/loyalty/loyalty-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Clock, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function CustomerDashboardPage() {
  const session = await getServerSession(customerAuthOptions)

  if (!session?.user?.id) {
    redirect("/customer/login")
  }

  const customer = await db.customer.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          orders: true,
          favoriteItems: true,
        },
      },
    },
  })

  if (!customer) {
    redirect("/customer/login")
  }

  // Get recent orders
  const recentOrders = await db.order.findMany({
    where: { customerId: customer.id },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
      },
      items: {
        take: 2,
        include: {
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {customer.name}!</h1>
        <p className="text-gray-500 mt-2">
          Here's what's happening with your account
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customer._count.orders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Favorite Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customer._count.favoriteItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Loyalty Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customer.loyaltyPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{customer.loyaltyTier} Tier</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest orders</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders yet</p>
                <Link href="/order">
                  <Button className="mt-4">Start Ordering</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/customer/orders/${order.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Order #{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {order.restaurant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(Number(order.total))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === "COMPLETED" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className="text-sm capitalize">{order.status}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/customer/orders">
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loyalty Dashboard */}
        <LoyaltyDashboard />
      </div>
    </div>
  )
}

