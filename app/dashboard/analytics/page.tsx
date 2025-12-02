import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export const revalidate = 60

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string; groupBy?: string }>
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

  // Default date range: last 30 days
  const endDate = params.endDate
    ? new Date(params.endDate)
    : new Date()
  const startDate = params.startDate
    ? new Date(params.startDate)
    : (() => {
        const date = new Date()
        date.setDate(date.getDate() - 30)
        return date
      })()

  const groupBy = (params.groupBy as "day" | "week" | "month") || "day"

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your restaurant's performance and insights
        </p>
      </div>

      <AnalyticsDashboard
        restaurantId={restaurant.id}
        defaultStartDate={startDate.toISOString().split("T")[0]}
        defaultEndDate={endDate.toISOString().split("T")[0]}
        defaultGroupBy={groupBy}
      />
    </div>
  )
}
