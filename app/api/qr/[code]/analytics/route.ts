import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code } = await params

    const qrCode = await db.qRCode.findFirst({
      where: {
        code,
        restaurant: {
          ownerId: session.user.id,
        },
      },
      include: {
        scans: {
          orderBy: {
            scannedAt: "desc",
          },
          take: 100,
        },
      },
    })

    if (!qrCode) {
      return NextResponse.json({ error: "QR code not found" }, { status: 404 })
    }

    // Calculate analytics
    const totalScans = qrCode.scanCount
    const uniqueScans = new Set(qrCode.scans.map((s) => s.ipAddress)).size

    // Group scans by date
    const scansByDate = qrCode.scans.reduce((acc, scan) => {
      const date = new Date(scan.scannedAt).toISOString().split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const scansByDateArray = Object.entries(scansByDate).map(([date, count]) => ({
      date,
      count,
    }))

    return NextResponse.json({
      totalScans,
      uniqueScans,
      scansByDate: scansByDateArray,
      lastScannedAt: qrCode.lastScannedAt,
    })
  } catch (error) {
    console.error("Error fetching QR analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

