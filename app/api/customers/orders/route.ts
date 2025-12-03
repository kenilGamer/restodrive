import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: any = { customerId: session.user.id }
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          items: {
            include: {
              menuItem: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            take: 3, // Show first 3 items
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      db.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Get customer orders error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

