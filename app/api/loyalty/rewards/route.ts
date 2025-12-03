import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
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

    // Define available rewards
    const rewards = [
      {
        id: "discount_100",
        name: "₹100 Discount",
        description: "Get ₹100 off on your next order",
        pointsRequired: 1000,
        type: "DISCOUNT",
        value: 100,
      },
      {
        id: "discount_250",
        name: "₹250 Discount",
        description: "Get ₹250 off on your next order",
        pointsRequired: 2500,
        type: "DISCOUNT",
        value: 250,
      },
      {
        id: "discount_500",
        name: "₹500 Discount",
        description: "Get ₹500 off on your next order",
        pointsRequired: 5000,
        type: "DISCOUNT",
        value: 500,
      },
      {
        id: "free_delivery",
        name: "Free Delivery",
        description: "Free delivery on your next order",
        pointsRequired: 500,
        type: "FREE_DELIVERY",
        value: 0,
      },
      {
        id: "birthday_bonus",
        name: "Birthday Bonus",
        description: "Extra points on your birthday",
        pointsRequired: 0,
        type: "BIRTHDAY_BONUS",
        value: LOYALTY_CONFIG.BIRTHDAY_BONUS.POINTS,
      },
    ]

    return NextResponse.json({ rewards })
  } catch (error) {
    console.error("Get rewards error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

