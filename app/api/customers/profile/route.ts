import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const customer = await db.customer.findUnique({
      where: { id: session.user.id },
      include: {
        addresses: {
          orderBy: { isDefault: "desc" },
        },
        _count: {
          select: {
            orders: true,
            favoriteItems: true,
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }

    // Remove password from response
    const { password, ...customerData } = customer

    return NextResponse.json({
      customer: customerData,
    })
  } catch (error) {
    console.error("Get customer profile error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
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
      name,
      email,
      phone,
      avatar,
      dateOfBirth,
      dietaryPreferences,
      allergies,
      favoriteCuisines,
      password,
      currentPassword,
    } = body

    const customer = await db.customer.findUnique({
      where: { id: session.user.id },
    })

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      )
    }

    // Update password if provided
    if (password && currentPassword) {
      if (!customer.password) {
        return NextResponse.json(
          { error: "Current password required" },
          { status: 400 }
        )
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        customer.password
      )

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await db.customer.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      })
    }

    // Update other fields
    const updateData: any = {}
    if (name) updateData.name = name
    if (email && email !== customer.email) {
      // Check if email is already taken
      const existing = await db.customer.findUnique({ where: { email } })
      if (existing && existing.id !== customer.id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
      updateData.email = email
      updateData.emailVerified = false // Require re-verification
    }
    if (phone && phone !== customer.phone) {
      // Check if phone is already taken
      const existing = await db.customer.findUnique({ where: { phone } })
      if (existing && existing.id !== customer.id) {
        return NextResponse.json(
          { error: "Phone number already in use" },
          { status: 400 }
        )
      }
      updateData.phone = phone
      updateData.phoneVerified = false // Require re-verification
    }
    if (avatar !== undefined) updateData.avatar = avatar
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth)
    if (dietaryPreferences) updateData.dietaryPreferences = dietaryPreferences
    if (allergies) updateData.allergies = allergies
    if (favoriteCuisines) updateData.favoriteCuisines = favoriteCuisines

    const updatedCustomer = await db.customer.update({
      where: { id: session.user.id },
      data: updateData,
    })

    const { password: _, ...customerData } = updatedCustomer

    return NextResponse.json({
      success: true,
      customer: customerData,
    })
  } catch (error) {
    console.error("Update customer profile error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

