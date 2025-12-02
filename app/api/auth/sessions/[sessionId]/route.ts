import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// DELETE - Revoke a specific session
export async function DELETE(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params

    // Verify the session belongs to the current user
    const userSession = await db.userSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    })

    if (!userSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Deactivate the session
    await db.userSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: "Session revoked successfully",
    })
  } catch (error) {
    console.error("Error revoking session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update session last active time
export async function PATCH(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params

    await db.userSession.updateMany({
      where: {
        id: sessionId,
        userId: session.user.id,
        isActive: true,
      },
      data: {
        lastActive: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

