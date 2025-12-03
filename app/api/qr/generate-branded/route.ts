import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { randomBytes } from "crypto"
import QRCode from "qrcode"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      restaurantId,
      type = "MENU",
      customization = {},
    } = body

    // Verify restaurant ownership
    const restaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
      },
      select: {
        id: true,
        slug: true,
        logo: true,
        primaryColor: true,
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }

    // Generate unique QR code
    const code = randomBytes(8).toString("hex").toUpperCase()
    const url = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/qr/${restaurant.slug}`

    // Customization options
    const {
      includeLogo = true,
      logoSize = 60,
      foregroundColor = restaurant.primaryColor || "#000000",
      backgroundColor = "#FFFFFF",
      frameStyle = "square", // square, rounded, circle
      frameColor = foregroundColor,
      errorCorrectionLevel = "M", // L, M, Q, H
    } = customization

    // Generate QR code with customization
    let qrImageUrl: string

    try {
      // Generate QR code with custom colors
      qrImageUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: errorCorrectionLevel as any,
        type: "image/png",
        width: 300,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      })

      // Note: Logo embedding requires canvas manipulation which is better done client-side
      // For now, we generate the QR code with custom colors
      // Logo can be added via CSS overlay or client-side canvas manipulation
      
      // If logo should be included, we'll store that preference
      // The actual logo embedding can be done client-side for better performance
    } catch (qrError) {
      console.error("Error generating QR code:", qrError)
      // Fallback to external QR service
      const fgColor = foregroundColor.replace("#", "")
      const bgColor = backgroundColor.replace("#", "")
      qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&color=${fgColor}&bgcolor=${bgColor}&ecc=${errorCorrectionLevel}`
    }

    // Store customization options in database (as JSON)
    const qrCode = await db.qRCode.create({
      data: {
        code,
        type: type as any,
        url,
        imageUrl: qrImageUrl,
        restaurantId,
        // Store customization in a JSON field if schema supports it
        // For now, we'll store it in imageUrl or create a separate field
      },
    })

    return NextResponse.json({
      qrCode: {
        ...qrCode,
        imageUrl: qrImageUrl,
        customization: {
          includeLogo,
          logoSize,
          foregroundColor,
          backgroundColor,
          frameStyle,
        },
      },
    })
  } catch (error) {
    console.error("Error generating branded QR code:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

