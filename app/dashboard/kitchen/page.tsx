import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { KitchenDisplaySystem } from "@/components/kitchen/kitchen-display-system"

// Cache for 10 seconds - kitchen orders need near real-time updates
export const revalidate = 10

export default async function KitchenPage() {
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
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">No Restaurant Found</h1>
          <p className="text-gray-400">Please create a restaurant first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <KitchenDisplaySystem restaurantId={restaurant.id} />
    </div>
  )
}

