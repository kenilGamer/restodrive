import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"
import { LOYALTY_CONFIG } from "@/lib/loyalty-config"

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
        referralCode: true,
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }

    // Get referral stats
    const [totalReferrals, completedReferrals] = await Promise.all([
      db.referral.count({
        where: { referrerId: session.user.id },
      }),
      db.referral.count({
        where: {
          referrerId: session.user.id,
          status: "COMPLETED",
        },
      }),
    ])

    // Calculate total points earned from referrals
    const referralPoints = await db.loyaltyPoints.aggregate({
      where: {
        customerId: session.user.id,
        type: "REFERRAL_EARNED",
      },
      _sum: {
        points: true,
      },
    })

    return NextResponse.json({
      referralCode: customer.referralCode,
      totalReferrals,
      completedReferrals,
      totalPointsEarned: referralPoints._sum.points || 0,
      referrerReward: LOYALTY_CONFIG.REFERRAL.REFERRER_POINTS,
      referredReward: LOYALTY_CONFIG.REFERRAL.REFERRED_POINTS,
      referralUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/customer/register?ref=${customer.referralCode}`,
    })
  } catch (error) {
    console.error("Get referral info error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

