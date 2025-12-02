import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { authenticator } from "otplib"
import QRCode from "qrcode"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If 2FA is already enabled, return the status
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      return NextResponse.json({
        enabled: true,
        message: "2FA is already enabled",
      })
    }

    // Generate a new secret if one doesn't exist
    let secret = user.twoFactorSecret
    if (!secret) {
      secret = authenticator.generateSecret()
      
      // Save the secret (but don't enable 2FA yet - user needs to verify first)
      await db.user.update({
        where: { id: user.id },
        data: { twoFactorSecret: secret },
      })
    }

    // Generate the OTP Auth URL
    const serviceName = "RestoDrive"
    const accountName = user.email
    const otpAuthUrl = authenticator.keyuri(accountName, serviceName, secret)

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl)

    return NextResponse.json({
      secret,
      qrCode: qrCodeDataUrl,
      manualEntryKey: secret,
    })
  } catch (error) {
    console.error("Error setting up 2FA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

