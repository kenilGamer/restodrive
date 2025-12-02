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
    
    // Extract IP address, preferring IPv4
    let ipAddress = forwardedFor?.split(",")[0]?.trim() || realIp || "Unknown"
    
    // Convert IPv6 loopback to IPv4
    if (ipAddress === "::1" || ipAddress === "::ffff:127.0.0.1") {
      ipAddress = "127.0.0.1"
    }
    
    // If it's an IPv6-mapped IPv4 address, extract the IPv4 part
    if (ipAddress.startsWith("::ffff:")) {
      ipAddress = ipAddress.replace("::ffff:", "")
    }

    // Parse user agent
    const { device, browser, os } = parseUserAgent(userAgent)

    // Get location (simplified - in production, use a geolocation service)
    const location = "Unknown Location" // TODO: Integrate geolocation service

    // Check if session already exists (by user agent and IP)
    // @ts-expect-error - userSession will be available after Prisma client regeneration
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
      // @ts-expect-error - userSession will be available after Prisma client regeneration
      await db.userSession.update({
        where: { id: existingSession.id },
        data: { lastActive: new Date() },
      })
      return NextResponse.json({ session: existingSession, isNew: false })
    }

    // Create new session
    // @ts-expect-error - userSession will be available after Prisma client regeneration
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

