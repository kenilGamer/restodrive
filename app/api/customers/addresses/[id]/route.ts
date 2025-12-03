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
    const body = await req.json()

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

    // If setting as default, unset other defaults
    if (body.isDefault) {
      await db.customerAddress.updateMany({
        where: {
          customerId: session.user.id,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      })
    }

    const updatedAddress = await db.customerAddress.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({
      success: true,
      address: updatedAddress,
    })
  } catch (error) {
    console.error("Update address error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await db.customerAddress.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Delete address error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

