import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get restaurant website settings
export async function GET(
  req: Request,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { restaurantId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const restaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        coverImage: true,
        isPublished: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        website: true,
      },
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json({ restaurant })
  } catch (error) {
    console.error("Error fetching restaurant website:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update restaurant website settings
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { restaurantId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      description,
      coverImage,
      isPublished,
      primaryColor,
      secondaryColor,
      fontFamily,
      website,
    } = body

    const restaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
      },
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const updatedRestaurant = await db.restaurant.update({
      where: { id: restaurantId },
      data: {
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isPublished !== undefined && { isPublished }),
        ...(primaryColor !== undefined && { primaryColor }),
        ...(secondaryColor !== undefined && { secondaryColor }),
        ...(fontFamily !== undefined && { fontFamily }),
        ...(website !== undefined && { website }),
      },
    })

    // Revalidate the restaurant website page after update
    const response = NextResponse.json({ restaurant: updatedRestaurant })
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    
    return response
  } catch (error) {
    console.error("Error updating restaurant website:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

