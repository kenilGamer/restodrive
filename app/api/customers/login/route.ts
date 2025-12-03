import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signIn } from "next-auth/react"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, phone, password } = body

    if (!password || (!email && !phone)) {
      return NextResponse.json(
        { error: "Email/phone and password are required" },
        { status: 400 }
      )
    }

    // Find customer by email or phone
    // Normalize phone number (remove spaces, dashes, etc.)
    const rawPhone = phone ? phone.replace(/\D/g, "") : null
    const normalizedEmail = email ? email.toLowerCase().trim() : null
    
    // Try exact match first
    let customer = null
    if (normalizedEmail) {
      customer = await (db as any).customer.findUnique({
        where: { email: normalizedEmail },
      })
    }
    
    if (!customer && rawPhone) {
      // Try exact match with the phone as provided
      customer = await (db as any).customer.findUnique({
        where: { phone: rawPhone },
      })
      
      // If not found and phone starts with country code, try without it
      if (!customer && rawPhone.startsWith("91") && rawPhone.length === 12) {
        const phoneWithoutCountryCode = rawPhone.substring(2)
        customer = await (db as any).customer.findUnique({
          where: { phone: phoneWithoutCountryCode },
        })
      }
      
      // If not found and phone is 10 digits, try with country code
      if (!customer && rawPhone.length === 10) {
        customer = await (db as any).customer.findUnique({
          where: { phone: `91${rawPhone}` },
        })
      }
    }

    if (!customer || !customer.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!customer.isActive || customer.isBlocked) {
      return NextResponse.json(
        { error: "Account is blocked or inactive" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customer.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Update last login
    await (db as any).customer.update({
      where: { id: customer.id },
      data: { lastLoginAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        phone: customer.phone,
        name: customer.name,
      },
    })
  } catch (error) {
    console.error("Customer login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

