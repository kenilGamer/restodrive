import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { categoryId } = await params
    const body = await req.json()

    // Verify category ownership
    const category = await db.category.findFirst({
      where: {
        id: categoryId,
        menu: {
          restaurant: {
            ownerId: session.user.id,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const {
      name,
      description,
      price,
      image,
      allergens,
      dietaryTags,
      spiceLevel,
      customTags,
      isVegetarian,
      isVegan,
      preparationTime,
      displayOrder,
    } = body

    const menuItem = await db.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || [],
        allergens: allergens || [],
        dietaryTags: dietaryTags || [],
        spiceLevel: spiceLevel || "MILD",
        customTags: customTags || [],
        isVegetarian: isVegetarian || false,
        isVegan: isVegan || false,
        preparationTime: preparationTime ? parseInt(preparationTime) : null,
        displayOrder: displayOrder ?? 0,
        categoryId,
      },
    })

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

