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

    const categories = await db.category.findMany({
      where: { menuId },
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
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const { name, description, displayOrder } = body

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

    const category = await db.category.create({
      data: {
        name,
        description,
        displayOrder: displayOrder ?? 0,
        menuId,
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

