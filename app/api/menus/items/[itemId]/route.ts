import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params

    const menuItem = await db.menuItem.findFirst({
      where: {
        id: itemId,
        category: {
          menu: {
            restaurant: {
              ownerId: session.user.id,
            },
          },
        },
      },
      include: {
        variants: true,
        modifiers: true,
        category: true,
      },
    })

    if (!menuItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error("Error fetching menu item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params
    const body = await req.json()

    // Verify item ownership
    const existingItem = await db.menuItem.findFirst({
      where: {
        id: itemId,
        category: {
          menu: {
            restaurant: {
              ownerId: session.user.id,
            },
          },
        },
      },
    })

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const menuItem = await db.menuItem.update({
      where: { id: itemId },
      data: {
        name: body.name,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        image: body.image,
        allergens: body.allergens,
        dietaryTags: body.dietaryTags,
        spiceLevel: body.spiceLevel,
        customTags: body.customTags,
        isVegetarian: body.isVegetarian,
        isVegan: body.isVegan,
        isAvailable: body.isAvailable,
        preparationTime: body.preparationTime ? parseInt(body.preparationTime) : null,
        displayOrder: body.displayOrder,
      },
    })

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params

    // Verify item ownership
    const menuItem = await db.menuItem.findFirst({
      where: {
        id: itemId,
        category: {
          menu: {
            restaurant: {
              ownerId: session.user.id,
            },
          },
        },
      },
    })

    if (!menuItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    await db.menuItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

