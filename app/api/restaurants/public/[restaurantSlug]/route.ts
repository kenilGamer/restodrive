import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Get public restaurant data for website
export async function GET(
  req: Request,
  { params }: { params: Promise<{ restaurantSlug: string }> }
) {
  try {
    const { restaurantSlug } = await params

    const restaurant = await db.restaurant.findUnique({
      where: { slug: restaurantSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        coverImage: true,
        phone: true,
        email: true,
        website: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
        cuisineType: true,
        priceRange: true,
        openingHours: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        isPublished: true,
        menus: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            categories: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                items: {
                  where: { isAvailable: true },
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    image: true,
                  },
                  take: 6,
                },
              },
              take: 4,
            },
          },
          take: 1,
        },
        branches: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
          take: 5,
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    if (!restaurant.isPublished) {
      return NextResponse.json(
        { error: "Restaurant website is not published" },
        { status: 403 }
      )
    }

    return NextResponse.json({ restaurant })
  } catch (error) {
    console.error("Error fetching public restaurant:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

