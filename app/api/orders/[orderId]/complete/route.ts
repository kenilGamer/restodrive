import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { calculatePointsEarned, getTierFromPoints, LOYALTY_CONFIG } from "@/lib/loyalty-config"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Only award points if order is completed and customer exists
    if (order.status !== "COMPLETED" || !order.customerId || !order.customer) {
      return NextResponse.json({
        success: true,
        message: "Order completed (no points awarded)",
      })
    }

    // Check if points already awarded
    if (order.loyaltyPointsEarned > 0) {
      return NextResponse.json({
        success: true,
        message: "Points already awarded",
      })
    }

    const customer = order.customer
    const orderTotal = Number(order.total)

    // Calculate points earned
    const pointsEarned = calculatePointsEarned(orderTotal, customer.loyaltyTier)

    if (pointsEarned > 0) {
      // Create loyalty points transaction
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + LOYALTY_CONFIG.POINTS_EXPIRATION_DAYS)

      await db.loyaltyPoints.create({
        data: {
          customerId: customer.id,
          points: pointsEarned,
          type: "ORDER_EARNED",
          description: `Points earned from order #${order.orderNumber}`,
          orderId: order.id,
          expiresAt,
          status: "ACTIVE",
        },
      })

      // Update customer points
      const newPointsTotal = customer.loyaltyPoints + pointsEarned
      const newTier = getTierFromPoints(newPointsTotal)

      await db.customer.update({
        where: { id: customer.id },
        data: {
          loyaltyPoints: newPointsTotal,
          loyaltyTier: newTier,
        },
      })

      // Update order with points earned
      await db.order.update({
        where: { id: order.id },
        data: {
          loyaltyPointsEarned: pointsEarned,
        },
      })

      // Check for referral completion
      if (customer.referredBy) {
        const referral = await db.referral.findUnique({
          where: { referredId: customer.id },
        })

        if (referral && referral.status === "PENDING") {
          // Award referrer points
          await db.loyaltyPoints.create({
            data: {
              customerId: referral.referrerId,
              points: LOYALTY_CONFIG.REFERRAL.REFERRER_POINTS,
              type: "REFERRAL_EARNED",
              description: `Referral bonus for ${customer.name}`,
              referralId: referral.id,
              status: "ACTIVE",
            },
          })

          // Update referrer points
          await db.customer.update({
            where: { id: referral.referrerId },
            data: {
              loyaltyPoints: {
                increment: LOYALTY_CONFIG.REFERRAL.REFERRER_POINTS,
              },
            },
          })

          // Award referred customer first order bonus
          await db.loyaltyPoints.create({
            data: {
              customerId: customer.id,
              points: LOYALTY_CONFIG.REFERRAL.REFERRED_FIRST_ORDER_BONUS,
              type: "REFERRAL_EARNED",
              description: "First order bonus from referral",
              referralId: referral.id,
              status: "ACTIVE",
            },
          })

          await db.customer.update({
            where: { id: customer.id },
            data: {
              loyaltyPoints: {
                increment: LOYALTY_CONFIG.REFERRAL.REFERRED_FIRST_ORDER_BONUS,
              },
            },
          })

          // Update referral status
          await db.referral.update({
            where: { id: referral.id },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
              firstOrderId: order.id,
              referrerPointsAwarded: LOYALTY_CONFIG.REFERRAL.REFERRER_POINTS,
              referredPointsAwarded: LOYALTY_CONFIG.REFERRAL.REFERRED_FIRST_ORDER_BONUS,
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      pointsEarned,
      message: "Order completed and points awarded",
    })
  } catch (error) {
    console.error("Complete order error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

