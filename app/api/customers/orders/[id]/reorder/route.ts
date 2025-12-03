import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
            variant: true,
            modifiers: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    if (order.customerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Return order items for reordering
    // The frontend will add these to the cart
    const reorderItems = order.items.map((item) => ({
      menuItemId: item.menuItemId,
      variantId: item.variantId,
      quantity: item.quantity,
      modifiers: item.modifiers.map((mod) => ({
        name: mod.name,
        price: mod.price,
      })),
      specialInstructions: item.specialInstructions,
    }))

    return NextResponse.json({
      success: true,
      items: reorderItems,
      restaurantId: order.restaurantId,
      restaurantSlug: order.restaurant.slug,
    })
  } catch (error) {
    console.error("Reorder error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

