import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"
import { LOYALTY_CONFIG, getTierFromPoints } from "@/lib/loyalty-config"

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

    const currentTier = customer.loyaltyTier
    const currentPoints = customer.loyaltyPoints
    const calculatedTier = getTierFromPoints(currentPoints)

    // Calculate progress to next tier
    let nextTier: "SILVER" | "GOLD" | "PLATINUM" | null = null
    let pointsToNextTier = 0
    let progressPercentage = 0

    if (calculatedTier === "BRONZE") {
      nextTier = "SILVER"
      pointsToNextTier = LOYALTY_CONFIG.TIER_THRESHOLDS.SILVER - currentPoints
      progressPercentage = (currentPoints / LOYALTY_CONFIG.TIER_THRESHOLDS.SILVER) * 100
    } else if (calculatedTier === "SILVER") {
      nextTier = "GOLD"
      pointsToNextTier = LOYALTY_CONFIG.TIER_THRESHOLDS.GOLD - currentPoints
      const tierRange = LOYALTY_CONFIG.TIER_THRESHOLDS.GOLD - LOYALTY_CONFIG.TIER_THRESHOLDS.SILVER
      const progressInTier = currentPoints - LOYALTY_CONFIG.TIER_THRESHOLDS.SILVER
      progressPercentage = (progressInTier / tierRange) * 100
    } else if (calculatedTier === "GOLD") {
      nextTier = "PLATINUM"
      pointsToNextTier = LOYALTY_CONFIG.TIER_THRESHOLDS.PLATINUM - currentPoints
      const tierRange = LOYALTY_CONFIG.TIER_THRESHOLDS.PLATINUM - LOYALTY_CONFIG.TIER_THRESHOLDS.GOLD
      const progressInTier = currentPoints - LOYALTY_CONFIG.TIER_THRESHOLDS.GOLD
      progressPercentage = (progressInTier / tierRange) * 100
    }

    const tierBenefits = LOYALTY_CONFIG.TIER_BENEFITS[calculatedTier]

    return NextResponse.json({
      currentTier: calculatedTier,
      currentPoints,
      tierBenefits,
      nextTier,
      pointsToNextTier,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
    })
  } catch (error) {
    console.error("Get tier info error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

