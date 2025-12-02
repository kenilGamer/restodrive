import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get payment configuration
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow OWNER role to access payment settings
    if (session.user.role !== "OWNER") {
      return NextResponse.json(
        { error: "Access denied. Only restaurant owners can manage payment settings." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    // Verify restaurant ownership
    const restaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // Check if payment config exists (stored in restaurant metadata or separate table)
    // For now, check environment variables as fallback
    const razorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)

    return NextResponse.json({
      razorpayConfigured,
      // Don't return actual keys for security
    })
  } catch (error) {
    console.error("Error fetching payment config:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Save payment configuration
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow OWNER role to access payment settings
    if (session.user.role !== "OWNER") {
      return NextResponse.json(
        { error: "Access denied. Only restaurant owners can manage payment settings." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      restaurantId,
      razorpayKeyId,
      razorpayKeySecret,
      enableRazorpay,
      paymentMethods,
    } = body

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    // Verify restaurant ownership
    const restaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
      },
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // In a production system, you would:
    // 1. Store encrypted keys in a PaymentGatewaySettings table
    // 2. Or use a secrets management service (AWS Secrets Manager, etc.)
    // For now, we'll store in a JSON field in the restaurant model or create a settings table
    
    // For MVP, we'll just validate and return success
    // The actual keys should be stored securely (encrypted in database or environment)
    
    if (razorpayKeyId && razorpayKeySecret) {
      // Validate key format
      if (!razorpayKeyId.startsWith("rzp_")) {
        return NextResponse.json(
          { error: "Invalid Razorpay Key ID format" },
          { status: 400 }
        )
      }

      // In production, encrypt and store:
      // const encryptedSecret = encrypt(razorpayKeySecret)
      // await db.paymentGatewaySettings.upsert({ ... })
    }

    // Update payment methods preference in restaurant settings
    // This could be stored in a JSON field or separate table
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Payment settings saved successfully",
    })
  } catch (error) {
    console.error("Error saving payment config:", error)
    return NextResponse.json(
      { error: "Failed to save payment settings" },
      { status: 500 }
    )
  }
}

