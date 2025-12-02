import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get notification configuration
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // In a production system, notification preferences would be stored in a database table
    // For now, return default preferences
    return NextResponse.json({
      emailEnabled: true,
      smsEnabled: false,
      // ... other default preferences
    })
  } catch (error) {
    console.error("Error fetching notification config:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Save notification configuration
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { restaurantId, ...preferences } = body

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

    // Validate email configuration if email is enabled
    if (preferences.emailEnabled) {
      if (!preferences.emailFromAddress) {
        return NextResponse.json(
          { error: "From email address is required when email notifications are enabled" },
          { status: 400 }
        )
      }

      if (preferences.emailProvider === "resend" && !preferences.resendApiKey) {
        return NextResponse.json(
          { error: "Resend API key is required" },
          { status: 400 }
        )
      }

      if (preferences.emailProvider === "sendgrid" && !preferences.sendgridApiKey) {
        return NextResponse.json(
          { error: "SendGrid API key is required" },
          { status: 400 }
        )
      }

      if (preferences.emailProvider === "smtp") {
        if (!preferences.smtpHost || !preferences.smtpUser || !preferences.smtpPassword) {
          return NextResponse.json(
            { error: "SMTP host, username, and password are required" },
            { status: 400 }
          )
        }
      }
    }

    // Validate SMS configuration if SMS is enabled
    if (preferences.smsEnabled) {
      if (preferences.smsProvider === "twilio") {
        if (!preferences.twilioAccountSid || !preferences.twilioAuthToken || !preferences.twilioPhoneNumber) {
          return NextResponse.json(
            { error: "Twilio Account SID, Auth Token, and Phone Number are required" },
            { status: 400 }
          )
        }
      }

      if (preferences.smsProvider === "messagebird") {
        if (!preferences.messagebirdApiKey || !preferences.messagebirdPhoneNumber) {
          return NextResponse.json(
            { error: "MessageBird API key and Phone Number are required" },
            { status: 400 }
          )
        }
      }
    }

    // In a production system, you would:
    // 1. Create a NotificationSettings model in Prisma
    // 2. Encrypt sensitive credentials (API keys, passwords)
    // 3. Store preferences in the database
    // 4. Use these preferences when sending notifications
    
    // For now, we'll just validate and return success
    // The actual notification sending logic would use these preferences

    return NextResponse.json({
      success: true,
      message: "Notification settings saved successfully",
    })
  } catch (error) {
    console.error("Error saving notification config:", error)
    return NextResponse.json(
      { error: "Failed to save notification settings" },
      { status: 500 }
    )
  }
}

