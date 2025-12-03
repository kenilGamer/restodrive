import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const customer = await db.customer.findUnique({
      where: { id: session.user.id },
      select: {
        loyaltyPoints: true,
        loyaltyTier: true,
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }

    // Calculate expiring soon points (within 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const expiringPoints = await db.loyaltyPoints.aggregate({
      where: {
        customerId: session.user.id,
        status: "ACTIVE",
        expiresAt: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
        points: {
          gt: 0,
        },
      },
      _sum: {
        points: true,
      },
    })

    return NextResponse.json({
      points: customer.loyaltyPoints,
      tier: customer.loyaltyTier,
      expiringSoon: expiringPoints._sum.points || 0,
    })
  } catch (error) {
    console.error("Get loyalty points error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

