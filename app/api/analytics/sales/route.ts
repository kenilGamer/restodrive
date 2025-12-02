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

    // Use SQL aggregation instead of fetching all orders
    // This is much faster for large datasets - aggregates in database
    // Use Prisma's queryRaw with proper parameter binding
    const breakdown = await db.$queryRaw<Array<{
      date: string
      revenue: number
      orders: number
    }>>`
      SELECT 
        ${groupBy === "week" 
          ? `DATE_TRUNC('week', "createdAt"::date)::text as date`
          : groupBy === "month"
          ? `TO_CHAR("createdAt", 'YYYY-MM') as date`
          : `DATE("createdAt")::text as date`
        },
        SUM("total")::decimal as revenue,
        COUNT(*)::integer as orders
      FROM "orders"
      WHERE "restaurantId" = ${restaurantId}
        AND "createdAt" >= ${start}
        AND "createdAt" <= ${end}
        AND "paymentStatus" = 'COMPLETED'
      GROUP BY ${groupBy === "week" 
        ? `DATE_TRUNC('week', "createdAt"::date)`
        : groupBy === "month"
        ? `TO_CHAR("createdAt", 'YYYY-MM')`
        : `DATE("createdAt")`
      }
      ORDER BY date ASC
    `

    // Calculate totals from breakdown (faster than separate query)
    const totalRevenue = breakdown.reduce((sum, item) => sum + Number(item.revenue), 0)
    const totalOrders = breakdown.reduce((sum, item) => sum + Number(item.orders), 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate trend (compare with previous period)
    const previousStart = new Date(start)
    const previousEnd = new Date(end)
    const periodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    previousStart.setDate(previousStart.getDate() - periodDays)
    previousEnd.setTime(previousStart.getTime() + (end.getTime() - start.getTime()))

    // Use aggregation instead of fetching all orders
    const previousRevenueResult = await db.order.aggregate({
      where: {
        restaurantId,
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
        paymentStatus: "COMPLETED",
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    })

    const previousRevenue = Number(previousRevenueResult._sum.total || 0)
    const previousOrders = previousRevenueResult._count.id

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
        previousOrders,
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

