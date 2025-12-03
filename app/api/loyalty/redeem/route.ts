import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"
import { LOYALTY_CONFIG, calculateDiscountFromPoints } from "@/lib/loyalty-config"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { points, orderTotal } = body

    if (!points || !orderTotal) {
      return NextResponse.json(
        { error: "Points and order total are required" },
        { status: 400 }
      )
    }

    if (points < LOYALTY_CONFIG.REDEMPTION.MIN_POINTS_TO_REDEEM) {
      return NextResponse.json(
        { error: `Minimum ${LOYALTY_CONFIG.REDEMPTION.MIN_POINTS_TO_REDEEM} points required to redeem` },
        { status: 400 }
      )
    }

    const customer = await db.customer.findUnique({
      where: { id: session.user.id },
    })

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }

    if (customer.loyaltyPoints < points) {
      return NextResponse.json(
        { error: "Insufficient points" },
        { status: 400 }
      )
    }

    // Calculate discount
    const discount = calculateDiscountFromPoints(points, orderTotal)

    // Create redemption transaction
    const transaction = await db.loyaltyPoints.create({
      data: {
        customerId: session.user.id,
        points: -points,
        type: "REDEMPTION",
        description: `Redeemed ${points} points for ₹${discount} discount`,
        status: "REDEEMED",
      },
    })

    // Update customer points
    await db.customer.update({
      where: { id: session.user.id },
      data: {
        loyaltyPoints: {
          decrement: points,
        },
      },
    })

    return NextResponse.json({
      success: true,
      discount,
      pointsUsed: points,
      transaction,
    })
  } catch (error) {
    console.error("Redeem points error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

