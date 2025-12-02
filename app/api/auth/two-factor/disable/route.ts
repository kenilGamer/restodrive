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
    const { token, password } = body

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true, twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user || !user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "2FA is not enabled" },
        { status: 400 }
      )
    }

    // Verify password
    if (!password) {
      return NextResponse.json(
        { error: "Password is required to disable 2FA" },
        { status: 400 }
      )
    }

    const bcrypt = require("bcryptjs")
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      )
    }

    // Verify 2FA token
    if (!token || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA verification code is required" },
        { status: 400 }
      )
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    })

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      )
    }

    // Disable 2FA and clear secret
    await db.user.update({
      where: { id: user.id },
      data: { 
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "2FA has been disabled successfully",
    })
  } catch (error) {
    console.error("Error disabling 2FA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

