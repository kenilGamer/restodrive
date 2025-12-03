import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { PremiumPOS } from "@/components/pos/premium-pos"

// Cache for 30 seconds - POS needs relatively fresh data
export const revalidate = 30

export default async function POSPage() {
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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-white">Point of Sale</h1>
        <p className="mt-2 text-sm text-gray-400">Quick checkout and order management</p>
      </div>
      <PremiumPOS restaurantId={restaurant.id} />
    </div>
  )
}
