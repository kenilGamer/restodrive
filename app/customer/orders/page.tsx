import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function CustomerOrdersPage() {
  const session = await getServerSession(customerAuthOptions)

  if (!session?.user?.id) {
    redirect("/customer/login")
  }

  const orders = await db.order.findMany({
    where: { customerId: session.user.id },
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
        take: 3,
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
    take: 50,
  })

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
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-500 mt-2">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No orders yet</p>
            <Link href="/order">
              <button className="px-4 py-2 bg-primary text-white rounded-lg">
                Start Ordering
              </button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/customer/orders/${order.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {order.restaurant.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm font-medium mt-2">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} • {formatCurrency(Number(order.total))}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

