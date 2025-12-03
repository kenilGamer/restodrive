import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"

export async function POST() {
  // Sign out is handled client-side
  return NextResponse.json({ success: true, redirect: "/customer/login" })
}

