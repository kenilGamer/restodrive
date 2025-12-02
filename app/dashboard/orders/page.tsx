import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { PremiumOrdersList } from "@/components/orders/premium-orders-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
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
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardHeader>
            <CardTitle className="text-white">No Restaurant Found</CardTitle>
            <CardDescription className="text-gray-400">
              Please create a restaurant first.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const status = params.status || "all"

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-white">Order Management</h1>
        <p className="mt-2 text-sm text-gray-400">
          Track and manage all orders from your restaurant
        </p>
      </div>

      <Tabs defaultValue={status} className="w-full">
        <TabsList className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[12px] p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            All Orders
          </TabsTrigger>
          <TabsTrigger
            value="PENDING"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="PREPARING"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            Preparing
          </TabsTrigger>
          <TabsTrigger
            value="READY"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            Ready
          </TabsTrigger>
          <TabsTrigger
            value="COMPLETED"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            Completed
          </TabsTrigger>
        </TabsList>
        <TabsContent value={status} className="mt-6">
          <PremiumOrdersList restaurantId={restaurant.id} status={status === "all" ? null : status} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
