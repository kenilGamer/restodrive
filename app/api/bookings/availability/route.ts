import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    const guestCount = parseInt(searchParams.get("guestCount") || "1")

    if (!restaurantId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    // Verify restaurant ownership
    const restaurant = await db.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: session.user.id,
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }

    // Parse date and time
    const targetDate = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    targetDate.setHours(hours, minutes || 0, 0, 0)

    // Get all tables for the restaurant
    const tables = await db.table.findMany({
      where: {
        restaurantId,
        isActive: true,
        capacity: {
          gte: guestCount,
        },
      },
      orderBy: {
        capacity: "asc",
      },
    })

    // Get existing reservations for the date/time
    const reservationDuration = 120 // Default 2 hours
    const reservationStart = new Date(targetDate)
    const reservationEnd = new Date(targetDate)
    reservationEnd.setMinutes(reservationEnd.getMinutes() + reservationDuration)

    const existingReservations = await db.reservation.findMany({
      where: {
        restaurantId,
        date: {
          gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
          lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1),
        },
        status: {
          notIn: ["CANCELLED", "COMPLETED", "NO_SHOW"],
        },
      },
      select: {
        tableId: true,
        time: true,
        duration: true,
      },
    })

    // Filter out tables that are already booked
    const availableTables = tables.filter((table) => {
      const conflictingReservation = existingReservations.find((res) => {
        if (!res.tableId || res.tableId !== table.id) return false

        const resTime = res.time.split(":").map(Number)
        const resStart = new Date(targetDate)
        resStart.setHours(resTime[0], resTime[1] || 0, 0, 0)
        const resEnd = new Date(resStart)
        resEnd.setMinutes(resEnd.getMinutes() + (res.duration || 120))

        // Check if times overlap
        return (
          (targetDate >= resStart && targetDate < resEnd) ||
          (reservationEnd > resStart && reservationEnd <= resEnd) ||
          (targetDate <= resStart && reservationEnd >= resEnd)
        )
      })

      return !conflictingReservation
    })

    return NextResponse.json({
      available: availableTables.length > 0,
      availableTables: availableTables.map((table) => ({
        id: table.id,
        number: table.number,
        capacity: table.capacity,
        location: table.location,
      })),
    })
  } catch (error) {
    console.error("Error checking availability:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

