import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { authenticator } from "otplib"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { token } = body

    if (!token || typeof token !== "string" || token.length !== 6) {
      return NextResponse.json(
        { error: "Invalid token. Please enter a 6-digit code." },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA setup not found. Please set up 2FA first." },
        { status: 400 }
      )
    }

    // Verify the token
    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    })

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 400 }
      )
    }

    // Enable 2FA
    await db.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    })

    return NextResponse.json({
      success: true,
      message: "2FA has been enabled successfully",
    })
  } catch (error) {
    console.error("Error verifying 2FA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

