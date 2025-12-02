import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get single staff member
export async function GET(
  req: Request,
  { params }: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { staffId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const staff = await db.staff.findUnique({
      where: { id: staffId },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    })

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 })
    }

    // Verify restaurant ownership
    if (staff.restaurant.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("Error fetching staff:", error)
    return NextResponse.json(
      { error: "Failed to fetch staff member" },
      { status: 500 }
    )
  }
}

// PATCH - Update staff member
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { staffId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phone, role, pin, branchId, isActive } = body

    // Get staff and verify ownership
    const existingStaff = await db.staff.findUnique({
      where: { id: staffId },
      include: {
        restaurant: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    })

    if (!existingStaff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 })
    }

    if (existingStaff.restaurant.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Verify branch belongs to restaurant if provided
    if (branchId && branchId !== existingStaff.branchId) {
      const branch = await db.branch.findFirst({
        where: {
          id: branchId,
          restaurantId: existingStaff.restaurantId,
        },
      })

      if (!branch) {
        return NextResponse.json(
          { error: "Branch not found or doesn't belong to restaurant" },
          { status: 400 }
        )
      }
    }

    // Check if phone already exists for another staff member in same restaurant
    if (phone && phone !== existingStaff.phone) {
      const phoneExists = await db.staff.findFirst({
        where: {
          restaurantId: existingStaff.restaurantId,
          phone,
          id: { not: staffId },
        },
      })

      if (phoneExists) {
        return NextResponse.json(
          { error: "Staff member with this phone number already exists" },
          { status: 400 }
        )
      }
    }

    // Hash PIN if provided and changed
    let hashedPin = existingStaff.pin
    if (pin && pin !== existingStaff.pin) {
      // In production, use: hashedPin = await bcrypt.hash(pin, 10)
      hashedPin = pin // For now, store as-is (should be hashed in production)
    }

    const staff = await db.staff.update({
      where: { id: staffId },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email: email || null }),
        ...(phone && { phone }),
        ...(role && { role }),
        ...(pin && { pin: hashedPin }),
        ...(branchId !== undefined && { branchId: branchId || null }),
        ...(isActive !== undefined && { isActive }),
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

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("Error updating staff:", error)
    return NextResponse.json(
      { error: "Failed to update staff member" },
      { status: 500 }
    )
  }
}

// DELETE - Delete staff member
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { staffId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get staff and verify ownership
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      include: {
        restaurant: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    })

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 })
    }

    if (staff.restaurant.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await db.staff.delete({
      where: { id: staffId },
    })

    return NextResponse.json({ message: "Staff member deleted successfully" })
  } catch (error) {
    console.error("Error deleting staff:", error)
    return NextResponse.json(
      { error: "Failed to delete staff member" },
      { status: 500 }
    )
  }
}

