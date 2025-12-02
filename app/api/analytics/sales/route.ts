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
    const groupBy = searchParams.get("groupBy") || "day" // day, week, month

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

    // Get orders in date range
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
        subtotal: true,
        tax: true,
        deliveryFee: true,
        discount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Group by period
    const dailyBreakdown: Record<string, { revenue: number; orders: number }> = {}

    orders.forEach((order) => {
      let key: string
      const date = new Date(order.createdAt)

      switch (groupBy) {
        case "week":
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().split("T")[0]
          break
        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          break
        default:
          key = date.toISOString().split("T")[0]
      }

      if (!dailyBreakdown[key]) {
        dailyBreakdown[key] = { revenue: 0, orders: 0 }
      }
      dailyBreakdown[key].revenue += Number(order.total)
      dailyBreakdown[key].orders += 1
    })

    const breakdown = Object.entries(dailyBreakdown)
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate trend (compare with previous period)
    const previousStart = new Date(start)
    const previousEnd = new Date(end)
    const periodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    previousStart.setDate(previousStart.getDate() - periodDays)
    previousEnd.setTime(previousStart.getTime() + (end.getTime() - start.getTime()))

    const previousOrders = await db.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
        paymentStatus: "COMPLETED",
      },
    })

    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    )

    const trend =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0

    return NextResponse.json({
      period: {
        start: startDate,
        end: endDate,
      },
      totalRevenue,
      totalOrders,
      averageOrderValue,
      dailyBreakdown: breakdown,
      trend: trend.toFixed(1),
      comparison: {
        previousRevenue,
        previousOrders: previousOrders.length,
      },
    })
  } catch (error) {
    console.error("Error fetching sales analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

