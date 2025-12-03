import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify address belongs to customer
    const address = await db.customerAddress.findUnique({
      where: { id },
    })

    if (!address || address.customerId !== session.user.id) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      )
    }

    // Unset all other defaults
    await db.customerAddress.updateMany({
      where: {
        customerId: session.user.id,
        isDefault: true,
        id: { not: id },
      },
      data: { isDefault: false },
    })

    // Set this address as default
    const updatedAddress = await db.customerAddress.update({
      where: { id },
      data: { isDefault: true },
    })

    return NextResponse.json({
      success: true,
      address: updatedAddress,
    })
  } catch (error) {
    console.error("Set default address error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

