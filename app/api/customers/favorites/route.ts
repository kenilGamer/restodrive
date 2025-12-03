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
    const restaurantId = searchParams.get("restaurantId")

    const where: any = { customerId: session.user.id }
    if (restaurantId) {
      where.restaurantId = restaurantId
    }

    const favorites = await db.favoriteItem.findMany({
      where,
      include: {
        menuItem: {
          include: {
            category: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Get favorites error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { menuItemId, restaurantId } = body

    if (!menuItemId || !restaurantId) {
      return NextResponse.json(
        { error: "Menu item ID and restaurant ID are required" },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existing = await db.favoriteItem.findUnique({
      where: {
        customerId_menuItemId: {
          customerId: session.user.id,
          menuItemId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Item already in favorites" },
        { status: 400 }
      )
    }

    const favorite = await db.favoriteItem.create({
      data: {
        customerId: session.user.id,
        menuItemId,
        restaurantId,
      },
      include: {
        menuItem: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      favorite,
    })
  } catch (error) {
    console.error("Add favorite error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

