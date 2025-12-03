import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"
import { LOYALTY_CONFIG } from "@/lib/loyalty-config"

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
    const { referralCode } = body

    if (!referralCode) {
      return NextResponse.json(
        { error: "Referral code is required" },
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

    // Check if customer already has a referral
    if (customer.referredBy) {
      return NextResponse.json(
        { error: "Referral code already applied" },
        { status: 400 }
      )
    }

    // Find referrer
    const referrer = await db.customer.findUnique({
      where: { referralCode },
    })

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      )
    }

    if (referrer.id === customer.id) {
      return NextResponse.json(
        { error: "Cannot use your own referral code" },
        { status: 400 }
      )
    }

    // Create referral record
    const referral = await db.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: customer.id,
        referralCode,
        status: "PENDING",
      },
    })

    // Update customer's referredBy
    await db.customer.update({
      where: { id: customer.id },
      data: { referredBy: referrer.id },
    })

    // Award signup bonus to referred customer
    await db.loyaltyPoints.create({
      data: {
        customerId: customer.id,
        points: LOYALTY_CONFIG.REFERRAL.REFERRED_POINTS,
        type: "REFERRAL_EARNED",
        description: "Signup bonus from referral",
        status: "ACTIVE",
      },
    })

    // Update customer points
    await db.customer.update({
      where: { id: customer.id },
      data: {
        loyaltyPoints: {
          increment: LOYALTY_CONFIG.REFERRAL.REFERRED_POINTS,
        },
      },
    })

    return NextResponse.json({
      success: true,
      referral,
      message: "Referral code applied successfully",
    })
  } catch (error) {
    console.error("Apply referral code error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

