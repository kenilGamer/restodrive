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
    const limit = parseInt(searchParams.get("limit") || "10")

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

    // Get orders with items
    const orders = await db.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: start,
          lte: end,
        },
        paymentStatus: "COMPLETED",
      },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Calculate item statistics
    const itemStats: Record<
      string,
      {
        menuItemId: string
        name: string
        category: string
        quantitySold: number
        revenue: number
      }
    > = {}

    let totalRevenue = 0

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const menuItemId = item.menuItemId
        const itemPrice = Number(item.price)
        const quantity = item.quantity
        const subtotal = Number(item.subtotal)

        totalRevenue += subtotal

        if (!itemStats[menuItemId]) {
          itemStats[menuItemId] = {
            menuItemId,
            name: item.menuItem.name,
            category: item.menuItem.category.name,
            quantitySold: 0,
            revenue: 0,
          }
        }

        itemStats[menuItemId].quantitySold += quantity
        itemStats[menuItemId].revenue += subtotal
      })
    })

    // Convert to array and sort
    const topItems = Object.values(itemStats)
      .map((item) => ({
        ...item,
        percentageOfTotal: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)

    return NextResponse.json({
      topItems,
      totalRevenue,
    })
  } catch (error) {
    console.error("Error fetching item analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

