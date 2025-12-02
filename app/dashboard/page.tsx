import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { MetricCard } from "@/components/dashboard/metric-card"
import { DonutChart } from "@/components/dashboard/donut-chart"
import { BarChart } from "@/components/dashboard/bar-chart"
import { TrendingItems } from "@/components/dashboard/trending-items"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Cache this page for 60 seconds to reduce database load
export const revalidate = 60

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

  // Get today's stats (only if restaurant exists, run queries in parallel)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Get yesterday for comparison
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const [
    todayOrders,
    todayRevenue,
    yesterdayOrders,
    yesterdayRevenue,
    weekOrders,
    weekRevenue,
    avgExpense,
  ] = restaurant
    ? await Promise.all([
        db.order.count({
          where: {
            restaurantId: restaurant.id,
            createdAt: { gte: today },
          },
        }),
        db.order.aggregate({
          where: {
            restaurantId: restaurant.id,
            createdAt: { gte: today },
            paymentStatus: "COMPLETED",
          },
          _sum: { total: true },
        }),
        db.order.count({
          where: {
            restaurantId: restaurant.id,
            createdAt: { gte: yesterday, lt: today },
          },
        }),
        db.order.aggregate({
          where: {
            restaurantId: restaurant.id,
            createdAt: { gte: yesterday, lt: today },
            paymentStatus: "COMPLETED",
          },
          _sum: { total: true },
        }),
        db.order.count({
          where: {
            restaurantId: restaurant.id,
            createdAt: { gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) },
          },
        }),
        db.order.aggregate({
          where: {
            restaurantId: restaurant.id,
            createdAt: { gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) },
            paymentStatus: "COMPLETED",
          },
          _sum: { total: true },
        }),
        // Calculate average expense (simplified - using 30% of revenue as expense)
        db.order.aggregate({
          where: {
            restaurantId: restaurant.id,
            createdAt: { gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) },
            paymentStatus: "COMPLETED",
          },
          _avg: { total: true },
        }),
      ])
    : [
        0,
        { _sum: { total: null } },
        0,
        { _sum: { total: null } },
        0,
        { _sum: { total: null } },
        { _avg: { total: null } },
      ]

  const todayRevenueValue = Number(todayRevenue._sum.total || 0)
  const yesterdayRevenueValue = Number(yesterdayRevenue._sum.total || 0)
  const weekRevenueValue = Number(weekRevenue._sum.total || 0)
  const avgExpenseValue = Number(avgExpense._avg.total || 0) * 0.3

  const revenueChange =
    yesterdayRevenueValue > 0
      ? ((todayRevenueValue - yesterdayRevenueValue) / yesterdayRevenueValue) * 100
      : 0

  const ordersChange =
    yesterdayOrders > 0 ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 : 0

  const avgOrderValue = todayOrders > 0 ? todayRevenueValue / todayOrders : 0

  // Get current month name
  const currentMonth = today.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Donut chart data (mock data for now - can be enhanced with real analytics)
  const donutData = [
    { name: "Total Order", value: 35, color: "#FF6A55" },
    { name: "Running order", value: 22, color: "#C97AFF" },
    { name: "Customer Growth", value: 26, color: "#11C97A" },
    { name: "Total Revenue", value: 17, color: "#6B7CFF" },
  ]

  // Bar chart data (mock weekly data - can be enhanced with real analytics)
  const barData = [
    { day: "Sat", value: 120, isHighlighted: false },
    { day: "Sun", value: 180, isHighlighted: false },
    { day: "Mon", value: 150, isHighlighted: false },
    { day: "Tue", value: 265, isHighlighted: true },
    { day: "Wed", value: 200, isHighlighted: false },
    { day: "Thu", value: 175, isHighlighted: false },
    { day: "Fri", value: 220, isHighlighted: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Build your menu by adding categories and items
        </p>
      </div>

      {!restaurant ? (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardHeader>
            <CardTitle className="text-white">Get Started</CardTitle>
            <CardDescription className="text-gray-400">
              You don't have a restaurant yet. Create one to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Your restaurant will be created automatically when you register. If you're seeing this message, please contact support.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Premium Metric Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              name="Today's Revenue"
              value={formatCurrency(todayRevenueValue)}
              icon="DollarSign"
              accentColor="#11C97A"
              change={revenueChange}
              changeType={revenueChange >= 0 ? "positive" : "negative"}
            />
            <MetricCard
              name="Today's Order"
              value={todayOrders.toString()}
              icon="ShoppingCart"
              accentColor="#C97AFF"
              change={ordersChange}
              changeType={ordersChange >= 0 ? "positive" : "negative"}
            />
            <MetricCard
              name="Avg. Expense"
              value={formatCurrency(avgExpenseValue)}
              icon="TrendingUp"
              accentColor="#6B7CFF"
              change={null}
              changeType="neutral"
            />
            <MetricCard
              name="Avg. Revenue"
              value={formatCurrency(avgOrderValue)}
              icon="DollarSign"
              accentColor="#FF6A55"
              change={null}
              changeType="neutral"
            />
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Details Donut Chart */}
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-white">Sales Details</CardTitle>
                  <CardDescription className="text-gray-400">{currentMonth}</CardDescription>
                </div>
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-[120px] bg-[#0D0D0D] border-[#2A2A2A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    <SelectItem value="daily" className="text-white">Daily</SelectItem>
                    <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                    <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <DonutChart data={donutData} centerValue="100%" />
              </CardContent>
            </Card>

            {/* Order Chart */}
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white">Order Chart</CardTitle>
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-[120px] bg-[#0D0D0D] border-[#2A2A2A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    <SelectItem value="daily" className="text-white">Daily</SelectItem>
                    <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                    <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <BarChart data={barData} />
              </CardContent>
            </Card>
          </div>

          {/* Trending Items */}
          <TrendingItems restaurantId={restaurant.id} limit={10} />
        </>
      )}
    </div>
  )
}
