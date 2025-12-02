import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reservationId } = await params

    const reservation = await db.reservation.findFirst({
      where: {
        id: reservationId,
        restaurant: {
          ownerId: session.user.id,
        },
      },
      include: {
        table: true,
        branch: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reservationId } = await params

    // Verify ownership
    const existingReservation = await db.reservation.findFirst({
      where: {
        id: reservationId,
        restaurant: {
          ownerId: session.user.id,
        },
      },
    })

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      )
    }

    // Update reservation
    const updateData: any = {}

    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === "SEATED") {
        updateData.checkedIn = true
        updateData.checkedInAt = new Date()
      }
      if (body.status === "CANCELLED") {
        updateData.cancelledAt = new Date()
      }
    }

    if (body.date !== undefined && body.time !== undefined) {
      const reservationDate = new Date(body.date)
      const [hours, minutes] = body.time.split(":").map(Number)
      reservationDate.setHours(hours, minutes || 0, 0, 0)
      updateData.date = reservationDate
      updateData.time = body.time
    }

    if (body.guestCount !== undefined) {
      updateData.guestCount = parseInt(body.guestCount)
    }

    if (body.tableId !== undefined) {
      updateData.tableId = body.tableId || null
    }

    if (body.customerName !== undefined) {
      updateData.customerName = body.customerName
    }

    if (body.customerPhone !== undefined) {
      updateData.customerPhone = body.customerPhone
    }

    if (body.customerEmail !== undefined) {
      updateData.customerEmail = body.customerEmail
    }

    if (body.specialRequests !== undefined) {
      updateData.specialRequests = body.specialRequests
    }

    if (body.occasion !== undefined) {
      updateData.occasion = body.occasion
    }

    if (body.noShow !== undefined) {
      updateData.noShow = body.noShow
    }

    const reservation = await db.reservation.update({
      where: { id: reservationId },
      data: updateData,
      include: {
        table: {
          select: {
            id: true,
            number: true,
            capacity: true,
          },
        },
      },
    })

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reservationId } = await params

    // Verify ownership
    const reservation = await db.reservation.findFirst({
      where: {
        id: reservationId,
        restaurant: {
          ownerId: session.user.id,
        },
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      )
    }

    // Update status to cancelled instead of deleting
    await db.reservation.update({
      where: { id: reservationId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error cancelling reservation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

