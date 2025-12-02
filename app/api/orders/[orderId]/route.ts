import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId } = await params

    const order = await db.order.findFirst({
      where: {
        id: orderId,
        restaurant: {
          ownerId: session.user.id,
        },
      },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                category: true,
              },
            },
            variant: true,
            modifiers: {
              include: {
                modifier: true,
              },
            },
          },
        },
        payment: true,
        table: true,
        restaurant: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId } = await params
    const body = await req.json()

    // Verify order ownership
    const existingOrder = await db.order.findFirst({
      where: {
        id: orderId,
        restaurant: {
          ownerId: session.user.id,
        },
      },
    })

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const { status, estimatedTime, specialInstructions } = body

    const order = await db.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(estimatedTime && { estimatedTime: parseInt(estimatedTime) }),
        ...(specialInstructions && { specialInstructions }),
        ...(status === "PREPARING" && !existingOrder.startedAt && {
          startedAt: new Date(),
        }),
        ...(status === "READY" && !existingOrder.readyAt && {
          readyAt: new Date(),
        }),
        ...(status === "COMPLETED" && !existingOrder.completedAt && {
          completedAt: new Date(),
        }),
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

