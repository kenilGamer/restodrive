import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { TableBookingSystem } from "@/components/booking/table-booking-system"

// Cache for 30 seconds - bookings change frequently
export const revalidate = 30

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Optimize: Only fetch first restaurant
  const restaurants = await db.restaurant.findMany({
    where: { ownerId: session.user.id },
    take: 1, // Only need first restaurant
  })

  const restaurant = restaurants[0]

  if (!restaurant) {
    redirect("/dashboard")
  }

  return <TableBookingSystem restaurantId={restaurant.id} />
}
