import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// In production, integrate with Twilio or similar SMS service
// For now, we'll use a simple OTP verification system

const OTP_STORAGE = new Map<string, { code: string; expiresAt: number }>()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, phone, otp, type } = body // type: 'email' or 'phone'

    if (!otp || (!email && !phone)) {
      return NextResponse.json(
        { error: "OTP and email/phone are required" },
        { status: 400 }
      )
    }

    const identifier = email || phone!
    const storedOTP = OTP_STORAGE.get(identifier)

    if (!storedOTP) {
      return NextResponse.json(
        { error: "OTP not found or expired" },
        { status: 400 }
      )
    }

    if (Date.now() > storedOTP.expiresAt) {
      OTP_STORAGE.delete(identifier)
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      )
    }

    if (storedOTP.code !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      )
    }

    // Verify customer
    const customer = await db.customer.findUnique({
      where: email ? { email } : { phone },
    })

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }

    // Update verification status
    const updateData: any = {}
    if (type === "email" && email) {
      updateData.emailVerified = true
      updateData.emailVerifiedAt = new Date()
    } else if (type === "phone" && phone) {
      updateData.phoneVerified = true
      updateData.phoneVerifiedAt = new Date()
    }

    await db.customer.update({
      where: { id: customer.id },
      data: updateData,
    })

    // Remove used OTP
    OTP_STORAGE.delete(identifier)

    return NextResponse.json({
      success: true,
      verified: true,
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    const phone = searchParams.get("phone")
    const type = searchParams.get("type") || "email"

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone required" },
        { status: 400 }
      )
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const identifier = email || phone!
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    OTP_STORAGE.set(identifier, { code: otp, expiresAt })

    // In production, send OTP via SMS/Email service
    // For now, we'll return it in development
    if (process.env.NODE_ENV === "development") {
      console.log(`OTP for ${identifier}: ${otp}`)
    }

    // TODO: Integrate with Twilio for SMS or Resend for Email
    // if (type === "phone" && phone) {
    //   await sendSMS(phone, `Your OTP is ${otp}`)
    // } else if (type === "email" && email) {
    //   await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`)
    // }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // Only return OTP in development
      ...(process.env.NODE_ENV === "development" && { otp }),
    })
  } catch (error) {
    console.error("OTP generation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

