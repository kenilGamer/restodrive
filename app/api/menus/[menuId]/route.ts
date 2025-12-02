import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ menuId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { menuId } = await params

    const menu = await db.menu.findFirst({
      where: {
        id: menuId,
        restaurant: {
          ownerId: session.user.id,
        },
      },
      include: {
        categories: {
          include: {
            items: {
              include: {
                variants: true,
                modifiers: true,
              },
            },
          },
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    })

    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 })
    }

    return NextResponse.json({ menu })
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ menuId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { menuId } = await params
    const body = await req.json()
    const { name, description, isActive } = body

    // Verify menu ownership
    const existingMenu = await db.menu.findFirst({
      where: {
        id: menuId,
        restaurant: {
          ownerId: session.user.id,
        },
      },
    })

    if (!existingMenu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 })
    }

    const menu = await db.menu.update({
      where: { id: menuId },
      data: {
        name,
        description,
        isActive,
        ...(isActive && !existingMenu.isActive && { publishedAt: new Date() }),
      },
    })

    return NextResponse.json({ menu })
  } catch (error) {
    console.error("Error updating menu:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ menuId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { menuId } = await params

    // Verify menu ownership
    const menu = await db.menu.findFirst({
      where: {
        id: menuId,
        restaurant: {
          ownerId: session.user.id,
        },
      },
    })

    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 })
    }

    await db.menu.delete({
      where: { id: menuId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

