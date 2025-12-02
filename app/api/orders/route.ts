import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateOrderNumber } from "@/lib/utils"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: any = {
      restaurant: {
        ownerId: session.user.id,
      },
    }

    if (restaurantId) {
      where.restaurantId = restaurantId
    }

    if (status) {
      where.status = status
    }

    const orders = await db.order.findMany({
      where,
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
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    const {
      restaurantId,
      type,
      customerName,
      customerPhone,
      customerEmail,
      items,
      tableId,
      specialInstructions,
      deliveryAddress,
    } = body

    if (!restaurantId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify restaurant ownership (if authenticated)
    if (session?.user?.id) {
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
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const menuItem = await db.menuItem.findUnique({
        where: { id: item.menuItemId },
        include: {
          variants: true,
        },
      })

      if (!menuItem) {
        continue
      }

      let itemPrice = Number(menuItem.price)
      if (item.variantId) {
        const variant = menuItem.variants.find((v) => v.id === item.variantId)
        if (variant) {
          itemPrice = Number(variant.price)
        }
      }

      // Add modifier prices
      if (item.modifiers && item.modifiers.length > 0) {
        for (const modId of item.modifiers) {
          const modifier = await db.itemModifier.findUnique({
            where: { id: modId },
          })
          if (modifier) {
            itemPrice += Number(modifier.price)
          }
        }
      }

      const itemSubtotal = itemPrice * item.quantity
      subtotal += itemSubtotal

      orderItems.push({
        menuItemId: item.menuItemId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
        specialInstructions: item.specialInstructions || null,
        modifiers: item.modifiers || [],
      })
    }

    // Get restaurant settings
    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId },
    })

    const taxRate = Number(restaurant?.taxRate || 0.18)
    const serviceCharge = Number(restaurant?.serviceCharge || 0.1)

    const tax = subtotal * taxRate
    const service = subtotal * serviceCharge
    const total = subtotal + tax + service

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        restaurantId,
        type: type || "DINE_IN",
        status: "PENDING",
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        customerEmail: customerEmail || null,
        tableId: tableId || null,
        deliveryAddress: deliveryAddress || null,
        specialInstructions: specialInstructions || null,
        subtotal,
        tax,
        serviceCharge: service,
        total,
        items: {
          create: orderItems.map((item) => ({
            menuItemId: item.menuItemId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            specialInstructions: item.specialInstructions,
            modifiers: {
              create: item.modifiers.map((modifierId) => ({
                modifierId,
              })),
            },
          })),
        },
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
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

