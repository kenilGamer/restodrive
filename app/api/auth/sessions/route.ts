import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get all active sessions for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current request info to identify current session
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

    // @ts-expect-error - userSession will be available after Prisma client regeneration
    const userSessions = await db.userSession.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        lastActive: "desc",
      },
    })

    // Format sessions for display and identify current session
    const formattedSessions = userSessions.map((s) => {
      // Current session is the one matching current user agent and IP
      const isCurrent = s.userAgent === userAgent && s.ipAddress === ipAddress
      
      return {
        id: s.id,
        device: s.device || "Unknown Device",
        browser: s.browser || "Unknown Browser",
        os: s.os || "Unknown OS",
        ipAddress: s.ipAddress || "Unknown",
        location: s.location || "Unknown Location",
        lastActive: s.lastActive,
        createdAt: s.createdAt,
        isCurrent,
      }
    })

    return NextResponse.json({ sessions: formattedSessions })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new session (called on login)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { device, browser, os, ipAddress, location, userAgent, sessionToken } = body

    const userSession = await db.userSession.create({
      data: {
        userId: session.user.id,
        sessionToken,
        device,
        browser,
        os,
        ipAddress,
        location,
        userAgent,
        isActive: true,
      },
    })

    return NextResponse.json({ session: userSession })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

