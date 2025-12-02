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

    const restaurants = await db.restaurant.findMany({
      where: { ownerId: session.user.id },
      include: {
        menus: {
          include: {
            categories: {
              include: {
                items: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ restaurants })
  } catch (error) {
    console.error("Error fetching menus:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, restaurantId } = body

    if (!name || !restaurantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }

    const menu = await db.menu.create({
      data: {
        name,
        description,
        restaurantId,
      },
      include: {
        categories: true,
      },
    })

    return NextResponse.json({ menu })
  } catch (error) {
    console.error("Error creating menu:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

