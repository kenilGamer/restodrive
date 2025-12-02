import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateReservationNumber } from "@/lib/utils"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get("restaurantId")
    const date = searchParams.get("date")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = parseInt(searchParams.get("limit") || "100")

    const where: any = {
      restaurant: {
        ownerId: session.user.id,
      },
    }

    if (restaurantId) {
      where.restaurantId = restaurantId
    }

    if (status && status !== "all") {
      where.status = status
    }

    if (date) {
      const targetDate = new Date(date)
      targetDate.setHours(0, 0, 0, 0)
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)

      where.date = {
        gte: targetDate,
        lt: nextDay,
      }
    } else if (startDate && endDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      where.date = {
        gte: start,
        lte: end,
      }
    }

    const reservations = await db.reservation.findMany({
      where,
      include: {
        table: {
          select: {
            id: true,
            number: true,
            capacity: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { date: "asc" },
        { time: "asc" },
      ],
      take: limit,
    })

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    const {
      restaurantId,
      date,
      time,
      guestCount,
      customerName,
      customerPhone,
      customerEmail,
      specialRequests,
      occasion,
      tableId,
      branchId,
    } = body

    if (!restaurantId || !date || !time || !guestCount || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
    const reservationDate = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    reservationDate.setHours(hours, minutes || 0, 0, 0)

    // Create reservation
    const reservation = await db.reservation.create({
      data: {
        reservationNumber: generateReservationNumber(),
        restaurantId,
        branchId: branchId || null,
        tableId: tableId || null,
        date: reservationDate,
        time,
        guestCount: parseInt(guestCount),
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        specialRequests: specialRequests || null,
        occasion: occasion || null,
        status: "CONFIRMED",
      },
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
    console.error("Error creating reservation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

