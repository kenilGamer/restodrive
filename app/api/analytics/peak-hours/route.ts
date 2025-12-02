import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!restaurantId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    // Verify restaurant ownership
    const restaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
      },
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // Get orders
    const orders = await db.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: start,
          lte: end,
        },
        paymentStatus: "COMPLETED",
      },
      select: {
        id: true,
        createdAt: true,
        total: true,
      },
    })

    // Group by hour
    const hourlyStats: Record<number, { orderCount: number; revenue: number }> = {}
    const dayStats: Record<number, { orderCount: number; revenue: number }> = {}

    orders.forEach((order) => {
      const date = new Date(order.createdAt)
      const hour = date.getHours()
      const day = date.getDay() // 0 = Sunday, 6 = Saturday

      // Hourly stats
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { orderCount: 0, revenue: 0 }
      }
      hourlyStats[hour].orderCount += 1
      hourlyStats[hour].revenue += Number(order.total)

      // Day stats
      if (!dayStats[day]) {
        dayStats[day] = { orderCount: 0, revenue: 0 }
      }
      dayStats[day].orderCount += 1
      dayStats[day].revenue += Number(order.total)
    })

    // Convert to arrays
    const peakHours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orderCount: hourlyStats[hour]?.orderCount || 0,
      revenue: hourlyStats[hour]?.revenue || 0,
    }))

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const peakDays = dayNames.map((name, day) => ({
      day: name,
      orderCount: dayStats[day]?.orderCount || 0,
      revenue: dayStats[day]?.revenue || 0,
    }))

    // Find peak hour and day
    const maxHour = peakHours.reduce(
      (max, current) => (current.orderCount > max.orderCount ? current : max),
      peakHours[0]
    )
    const maxDay = peakDays.reduce(
      (max, current) => (current.orderCount > max.orderCount ? current : max),
      peakDays[0]
    )

    const totalOrders = orders.length
    const averageOrdersPerHour = totalOrders > 0 ? totalOrders / 24 : 0

    return NextResponse.json({
      peakHours,
      peakDays,
      peakHour: maxHour.hour,
      peakDay: maxDay.day,
      averageOrdersPerHour: Math.round(averageOrdersPerHour * 100) / 100,
    })
  } catch (error) {
    console.error("Error fetching peak hours analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

