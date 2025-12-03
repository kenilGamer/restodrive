import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { generateReferralCode } from "@/lib/loyalty-config"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, password, referralCode } = body

    // Validate required fields
    if (!name || (!email && !phone) || !password) {
      return NextResponse.json(
        { error: "Name, email/phone, and password are required" },
        { status: 400 }
      )
    }

    // Check if customer already exists
    if (email) {
      const existingEmail = await db.customer.findUnique({
        where: { email },
      })
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        )
      }
    }

    if (phone) {
      const existingPhone = await db.customer.findUnique({
        where: { phone },
      })
      if (existingPhone) {
        return NextResponse.json(
          { error: "Phone number already registered" },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate referral code
    const customerReferralCode = generateReferralCode(name)

    // Handle referral code if provided
    let referredBy = null
    if (referralCode) {
      const referrer = await db.customer.findUnique({
        where: { referralCode },
      })
      if (referrer) {
        referredBy = referrer.id
      }
    }

    // Create customer
    const customer = await db.customer.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        referralCode: customerReferralCode,
        referredBy,
        loyaltyPoints: 0,
        loyaltyTier: "BRONZE",
        emailVerified: false,
        phoneVerified: false,
      },
    })

    // Create referral record if referred
    if (referredBy) {
      await db.referral.create({
        data: {
          referrerId: referredBy,
          referredId: customer.id,
          referralCode: referralCode!,
          status: "PENDING",
        },
      })

      // Award signup bonus to referred customer
      await db.loyaltyPoints.create({
        data: {
          customerId: customer.id,
          points: 50, // Signup bonus
          type: "REFERRAL_EARNED",
          description: "Signup bonus from referral",
          status: "ACTIVE",
        },
      })

      // Update customer points
      await db.customer.update({
        where: { id: customer.id },
        data: { loyaltyPoints: 50 },
      })
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        phone: customer.phone,
        name: customer.name,
        referralCode: customer.referralCode,
      },
    })
  } catch (error) {
    console.error("Customer registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

