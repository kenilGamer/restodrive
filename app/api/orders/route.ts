import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateOrderNumber } from "@/lib/utils"
import { emitToRestaurant } from "@/lib/socket/emit"

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
            modifiers: true,
          },
        },
        payments: true,
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
    // Allow public orders (customers ordering from QR menu don't need to be authenticated)
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

    // Verify restaurant exists and get settings (public orders allowed for QR menu)
    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        id: true,
        taxRate: true,
        serviceCharge: true,
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
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

      // Add modifier prices and collect modifier details
      const modifierDetails = []
      if (item.modifiers && item.modifiers.length > 0) {
        for (const modId of item.modifiers) {
          const modifier = await db.itemModifier.findUnique({
            where: { id: modId },
          })
          if (modifier) {
            itemPrice += Number(modifier.price || 0)
            modifierDetails.push({
              name: modifier.name,
              price: Number(modifier.price || 0),
            })
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
        modifiers: modifierDetails,
      })
    }

    // Use restaurant settings (already fetched above)
    const taxRate = Number(restaurant.taxRate || 0.18)
    const serviceCharge = Number(restaurant.serviceCharge || 0.1)

    const tax = subtotal * taxRate
    // Handle loyalty points redemption
    let pointsRedeemed = 0
    let discountFromPoints = 0
    let finalTotal = subtotal + tax + service

    // Apply points redemption if customer is logged in and points provided
    if (customerId && loyaltyPointsRedeemed) {
      const { calculateDiscountFromPoints } = await import("@/lib/loyalty-config")

      const customer = await db.customer.findUnique({
        where: { id: customerId },
      })

      if (customer && customer.loyaltyPoints >= loyaltyPointsRedeemed) {
        discountFromPoints = calculateDiscountFromPoints(
          loyaltyPointsRedeemed,
          finalTotal
        )
        pointsRedeemed = loyaltyPointsRedeemed
        finalTotal = Math.max(0, finalTotal - discountFromPoints)

        // Deduct points immediately and create redemption transaction
        await Promise.all([
          db.customer.update({
            where: { id: customerId },
            data: {
              loyaltyPoints: {
                decrement: pointsRedeemed,
              },
            },
          }),
          db.loyaltyPoints.create({
            data: {
              customerId,
              points: -pointsRedeemed,
              type: "REDEMPTION",
              description: `Redeemed ${pointsRedeemed} points for order`,
              status: "REDEEMED",
            },
          }),
        ])
      }
    }

    const total = finalTotal

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        restaurantId,
        type: type || "DINE_IN",
        status: "PENDING",
        customerId: customerId || null,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        customerEmail: customerEmail || null,
        customerAddress: deliveryAddress || null,
        tableId: tableId || null,
        specialInstructions: specialInstructions || null,
        subtotal,
        tax,
        serviceCharge: service,
        discount: discountFromPoints,
        loyaltyPointsRedeemed: pointsRedeemed,
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
              create: item.modifiers.map((modifier) => ({
                name: modifier.name,
                price: modifier.price,
              })),
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            variant: true,
            modifiers: true,
          },
        },
      },
    })

    // Emit Socket.io event for new order
    emitToRestaurant(restaurantId, "order:created", { order })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

