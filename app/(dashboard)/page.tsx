import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Layout already handles authentication, but add safety check
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Get user's restaurants
  const restaurants = await db.restaurant.findMany({
    where: { ownerId: session.user.id },
    include: {
      _count: {
        select: {
          orders: true,
          reservations: true,
        },
      },
    },
  })

  const restaurant = restaurants[0]

  // Get today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = await db.order.count({
    where: {
      restaurantId: restaurant?.id,
      createdAt: {
        gte: today,
      },
    },
  })

  const todayRevenue = await db.order.aggregate({
    where: {
      restaurantId: restaurant?.id,
      createdAt: {
        gte: today,
      },
      paymentStatus: "COMPLETED",
    },
    _sum: {
      total: true,
    },
  })

  const stats = [
    {
      name: "Today's Revenue",
      value: formatCurrency(Number(todayRevenue._sum.total || 0)),
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive",
    },
    {
      name: "Today's Orders",
      value: todayOrders.toString(),
      icon: ShoppingCart,
      change: "+8.2%",
      changeType: "positive",
    },
    {
      name: "Total Reservations",
      value: restaurant?._count.reservations.toString() || "0",
      icon: Users,
      change: "+5.1%",
      changeType: "positive",
    },
    {
      name: "Growth Rate",
      value: "+15.3%",
      icon: TrendingUp,
      change: "+2.4%",
      changeType: "positive",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {session.user.name || "User"}! Here's what's happening with your restaurant.
        </p>
      </div>

      {!restaurant ? (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              You don't have a restaurant yet. Create one to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Your restaurant will be created automatically when you register. If you're seeing this message, please contact support.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">{stat.change}</span> from last period
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your restaurant</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Order management coming soon...
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reservations</CardTitle>
                <CardDescription>Today's table bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Reservation management coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

