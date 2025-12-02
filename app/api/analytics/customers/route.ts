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
        customerPhone: true,
        customerEmail: true,
        customerName: true,
        total: true,
        createdAt: true,
      },
    })

    // Group by customer (using phone as identifier)
    const customerStats: Record<
      string,
      {
        phone: string | null
        email: string | null
        name: string | null
        orderCount: number
        totalSpent: number
        firstOrder: Date
        lastOrder: Date
      }
    > = {}

    orders.forEach((order) => {
      const identifier = order.customerPhone || order.customerEmail || "anonymous"
      
      if (!customerStats[identifier]) {
        customerStats[identifier] = {
          phone: order.customerPhone,
          email: order.customerEmail,
          name: order.customerName,
          orderCount: 0,
          totalSpent: 0,
          firstOrder: order.createdAt,
          lastOrder: order.createdAt,
        }
      }

      customerStats[identifier].orderCount += 1
      customerStats[identifier].totalSpent += Number(order.total)
      
      if (order.createdAt < customerStats[identifier].firstOrder) {
        customerStats[identifier].firstOrder = order.createdAt
      }
      if (order.createdAt > customerStats[identifier].lastOrder) {
        customerStats[identifier].lastOrder = order.createdAt
      }
    })

    // Calculate metrics
    const customers = Object.values(customerStats)
    const newCustomers = customers.filter(
      (c) => c.firstOrder >= start && c.firstOrder <= end
    ).length
    const returningCustomers = customers.filter((c) => c.orderCount > 1).length
    const totalCustomers = customers.length
    const averageOrderValue =
      orders.length > 0
        ? orders.reduce((sum, o) => sum + Number(o.total), 0) / orders.length
        : 0
    const averageCustomerValue =
      customers.length > 0
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
        : 0

    // Customer frequency analysis
    const frequencyData = customers.map((customer) => {
      const daysSinceFirstOrder = Math.ceil(
        (customer.lastOrder.getTime() - customer.firstOrder.getTime()) / (1000 * 60 * 60 * 24)
      )
      const averageDaysBetweenOrders =
        customer.orderCount > 1 ? daysSinceFirstOrder / (customer.orderCount - 1) : null

      return {
        ...customer,
        daysSinceFirstOrder,
        averageDaysBetweenOrders,
      }
    })

    // Sort by total spent
    const topCustomers = frequencyData
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    return NextResponse.json({
      totalCustomers,
      newCustomers,
      returningCustomers,
      averageOrderValue,
      averageCustomerValue,
      topCustomers,
      frequencyData: frequencyData.slice(0, 50), // Limit for performance
    })
  } catch (error) {
    console.error("Error fetching customer analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

