import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingsList } from "@/components/bookings/bookings-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>
}) {
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

  const params = await searchParams
  const status = params.status || "all"

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage table reservations and bookings for your restaurant
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/bookings/new">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={status} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
          <TabsTrigger value="SEATED">Seated</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={status} className="mt-6">
          <BookingsList restaurantId={restaurant.id} initialStatus={status} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
