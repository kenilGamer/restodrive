import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const addresses = await db.customerAddress.findMany({
      where: { customerId: session.user.id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error("Get addresses error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      type,
      label,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      isDefault,
    } = body

    if (!fullName || !phone || !addressLine1 || !city) {
      return NextResponse.json(
        { error: "Full name, phone, address line 1, and city are required" },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.customerAddress.updateMany({
        where: {
          customerId: session.user.id,
          isDefault: true,
        },
        data: { isDefault: false },
      })
    }

    const address = await db.customerAddress.create({
      data: {
        customerId: session.user.id,
        type: type || "HOME",
        label,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country: country || "India",
        latitude,
        longitude,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json({
      success: true,
      address,
    })
  } catch (error) {
    console.error("Create address error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

