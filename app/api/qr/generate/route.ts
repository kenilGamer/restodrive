import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { randomBytes } from "crypto"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { restaurantId, type = "MENU" } = body

    // Verify restaurant ownership
    const restaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
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
    const url = `${process.env.APP_URL || "http://localhost:3000"}/qr/${restaurant.slug}`

    const qrCode = await db.qRCode.create({
      data: {
        code,
        type: type as any,
        url,
        restaurantId,
      },
    })

    // Generate QR code image URL (you can use a QR code generation service)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`

    return NextResponse.json({
      qrCode: {
        ...qrCode,
        imageUrl: qrImageUrl,
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

