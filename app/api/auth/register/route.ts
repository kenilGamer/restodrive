import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { slugify } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, restaurantName } = body

    if (!name || !email || !password || !restaurantName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and restaurant
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "OWNER",
        restaurants: {
          create: {
            name: restaurantName,
            slug: slugify(restaurantName),
          },
        },
      },
      include: {
        restaurants: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      restaurant: user.restaurants[0],
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

