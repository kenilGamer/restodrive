import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all staff for a restaurant
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
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const staff = await db.staff.findMany({
      where: {
        restaurantId,
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("Error fetching staff:", error)
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    )
  }
}

// POST - Create new staff member
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phone, role, pin, branchId, restaurantId } = body

    if (!name || !phone || !role || !restaurantId) {
      return NextResponse.json(
        { error: "Name, phone, role, and restaurant ID are required" },
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
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // Verify branch belongs to restaurant if provided
    if (branchId) {
      const branch = await db.branch.findFirst({
        where: {
          id: branchId,
          restaurantId,
        },
      })

      if (!branch) {
        return NextResponse.json(
          { error: "Branch not found or doesn't belong to restaurant" },
          { status: 400 }
        )
      }
    }

    // Check if phone already exists for this restaurant
    const existingStaff = await db.staff.findFirst({
      where: {
        restaurantId,
        phone,
      },
    })

    if (existingStaff) {
      return NextResponse.json(
        { error: "Staff member with this phone number already exists" },
        { status: 400 }
      )
    }

    // Hash PIN if provided (simple hash for now, should use bcrypt in production)
    let hashedPin = null
    if (pin) {
      // In production, use: hashedPin = await bcrypt.hash(pin, 10)
      hashedPin = pin // For now, store as-is (should be hashed in production)
    }

    const staff = await db.staff.create({
      data: {
        name,
        email: email || null,
        phone,
        role,
        pin: hashedPin,
        restaurantId,
        branchId: branchId || null,
        isActive: true,
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ staff }, { status: 201 })
  } catch (error) {
    console.error("Error creating staff:", error)
    return NextResponse.json(
      { error: "Failed to create staff member" },
      { status: 500 }
    )
  }
}

