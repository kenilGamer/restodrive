import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { StaffManagement } from "@/components/staff/staff-management"

// Cache for 60 seconds - staff changes infrequently
export const revalidate = 60

export default async function StaffPage() {
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

  // Fetch branches for the restaurant (optimized with select)
  const branches = await db.branch.findMany({
    where: { restaurantId: restaurant.id },
    select: {
      id: true,
      name: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-white">Staff Management</h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage your restaurant staff, roles, and permissions
        </p>
      </div>

      <StaffManagement restaurantId={restaurant.id} branches={branches} />
    </div>
  )
}

