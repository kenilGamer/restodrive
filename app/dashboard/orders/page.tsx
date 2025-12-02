import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { OrdersList } from "@/components/orders/orders-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  // Await searchParams in Next.js 15
  const params = await searchParams
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const restaurants = await db.restaurant.findMany({
    where: { ownerId: session.user.id },
  })

  const restaurant = restaurants[0]

  if (!restaurant) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>No Restaurant Found</CardTitle>
            <CardDescription>
              Please create a restaurant first.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const status = params.status || "all"

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and track all orders from your restaurant
        </p>
      </div>

      <Tabs defaultValue={status} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="PREPARING">Preparing</TabsTrigger>
          <TabsTrigger value="READY">Ready</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={status} className="mt-6">
          <OrdersList restaurantId={restaurant.id} status={status === "all" ? null : status} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

