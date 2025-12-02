import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ""
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.event) {
      case "payment.captured":
        // Payment was successfully captured
        const payment = event.payload.payment.entity
        await db.payment.updateMany({
          where: { transactionId: payment.id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        })
        break

      case "payment.failed":
        // Payment failed
        const failedPayment = event.payload.payment.entity
        await db.payment.updateMany({
          where: { transactionId: failedPayment.id },
          data: {
            status: "FAILED",
          },
        })
        break

      case "order.paid":
        // Order was paid
        const order = event.payload.order.entity
        await db.order.updateMany({
          where: { paymentIntentId: order.id },
          data: {
            paymentStatus: "COMPLETED",
          },
        })
        break

      default:
        console.log("Unhandled event type:", event.event)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

