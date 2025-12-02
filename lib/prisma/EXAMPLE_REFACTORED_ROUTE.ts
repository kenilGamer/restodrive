/**
 * EXAMPLE: Refactored API Route using Prisma Query Utilities
 * 
 * BEFORE: 77 lines with manual ownership checks and data transformation
 * AFTER: ~30 lines with automatic ownership verification
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { menuQueries } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { categoryId } = await params
    const body = await req.json()

    // Single line replaces 20+ lines of ownership verification and data transformation
    const menuItem = await menuQueries.createMenuItem(
      categoryId,
      session.user.id,
      body
    )

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error("Error creating menu item:", error)
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("not found") || error.message.includes("access denied")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * COMPARISON:
 * 
 * BEFORE (77 lines):
 * - Manual ownership verification (10 lines)
 * - Manual data transformation (15 lines)
 * - Manual Prisma query (15 lines)
 * - Error handling (5 lines)
 * 
 * AFTER (30 lines):
 * - Single function call handles everything
 * - Automatic ownership verification
 * - Automatic data transformation
 * - Type-safe with full IntelliSense support
 * 
 * BENEFITS:
 * - 60% less code
 * - Consistent error handling
 * - Type safety
 * - Reusable across all routes
 * - Easier to test
 * - Easier to maintain
 */

