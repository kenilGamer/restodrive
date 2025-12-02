import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get restaurant details
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
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json({ restaurant })
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update restaurant details
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

    // Verify restaurant ownership
    const existingRestaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
      },
    })

    if (!existingRestaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const body = await req.json()
    const {
      name,
      description,
      phone,
      email,
      website,
      address,
      city,
      state,
      country,
      zipCode,
      cuisineType,
      priceRange,
      openingHours,
      timezone,
      primaryColor,
      secondaryColor,
      fontFamily,
      currency,
      taxRate,
      serviceCharge,
      allowCOD,
      minOrderValue,
    } = body

    const restaurant = await db.restaurant.update({
      where: { id: restaurantId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(country !== undefined && { country }),
        ...(zipCode !== undefined && { zipCode }),
        ...(cuisineType !== undefined && { cuisineType }),
        ...(priceRange && { priceRange }),
        ...(openingHours !== undefined && { openingHours }),
        ...(timezone !== undefined && { timezone }),
        ...(primaryColor !== undefined && { primaryColor }),
        ...(secondaryColor !== undefined && { secondaryColor }),
        ...(fontFamily !== undefined && { fontFamily }),
        ...(currency !== undefined && { currency }),
        ...(taxRate !== undefined && { taxRate: parseFloat(taxRate) }),
        ...(serviceCharge !== undefined && { serviceCharge: parseFloat(serviceCharge) }),
        ...(allowCOD !== undefined && { allowCOD }),
        ...(minOrderValue !== undefined && { minOrderValue: parseFloat(minOrderValue) }),
      },
    })

    return NextResponse.json({ restaurant })
  } catch (error) {
    console.error("Error updating restaurant:", error)
    return NextResponse.json(
      { error: "Failed to update restaurant" },
      { status: 500 }
    )
  }
}

