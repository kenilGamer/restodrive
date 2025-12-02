import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { parseUserAgent } from "@/lib/user-agent"

// POST - Track/create a session (called after login from client)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get client info from request
    const userAgent = req.headers.get("user-agent") || ""
    const forwardedFor = req.headers.get("x-forwarded-for")
    const realIp = req.headers.get("x-real-ip")
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "Unknown"

    // Parse user agent
    const { device, browser, os } = parseUserAgent(userAgent)

    // Get location (simplified - in production, use a geolocation service)
    const location = "Unknown Location" // TODO: Integrate geolocation service

    // Check if session already exists (by user agent and IP)
    const existingSession = await db.userSession.findFirst({
      where: {
        userId: session.user.id,
        userAgent: userAgent,
        ipAddress: ipAddress,
        isActive: true,
      },
    })

    if (existingSession) {
      // Update last active time
      await db.userSession.update({
        where: { id: existingSession.id },
        data: { lastActive: new Date() },
      })
      return NextResponse.json({ session: existingSession, isNew: false })
    }

    // Create new session
    const userSession = await db.userSession.create({
      data: {
        userId: session.user.id,
        device,
        browser,
        os,
        ipAddress,
        location,
        userAgent,
        isActive: true,
      },
    })

    return NextResponse.json({ session: userSession, isNew: true })
  } catch (error) {
    console.error("Error tracking session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

