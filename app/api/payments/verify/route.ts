import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import crypto from "crypto"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, restaurantId, amount } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 })
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Create payment record in database
    if (orderId && restaurantId) {
      const payment = await db.payment.create({
        data: {
          amount: parseFloat(amount),
          currency: "INR",
          method: "UPI", // Default, can be updated based on payment method
          status: "COMPLETED",
          gateway: "RAZORPAY",
          transactionId: razorpay_payment_id,
          paymentIntentId: razorpay_order_id,
          restaurantId,
          orderId,
          metadata: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          },
        },
      })

      // Update order payment status
      await db.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "COMPLETED",
          paymentMethod: "UPI",
        },
      })

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        message: "Payment verified and recorded successfully",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    })
  } catch (error: any) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    )
  }
}

