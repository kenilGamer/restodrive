import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Eye } from "lucide-react"
import Link from "next/link"
import { QRGenerator } from "@/components/qr/qr-generator"

export default async function QRMenuPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const restaurants = await db.restaurant.findMany({
    where: { ownerId: session.user.id },
    include: {
      qrCodes: {
        include: {
          _count: {
            select: {
              scans: true,
            },
          },
        },
      },
      menus: {
        where: { isActive: true },
        take: 1,
      },
    },
  })

  const restaurant = restaurants[0]

  if (!restaurant) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>No Restaurant Found</CardTitle>
            <CardDescription>
              Please create a restaurant first.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">QR Menus</h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate QR codes for your digital menus
        </p>
      </div>

      {restaurant.qrCodes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No QR Codes Yet</CardTitle>
            <CardDescription>
              Generate your first QR code to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRGenerator restaurantId={restaurant.id} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurant.qrCodes.map((qrCode) => (
            <Card key={qrCode.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">QR Code</CardTitle>
                  <span className="text-xs text-gray-500">
                    {qrCode._count.scans} scans
                  </span>
                </div>
                <CardDescription>Code: {qrCode.code}</CardDescription>
              </CardHeader>
              <CardContent>
                {qrCode.imageUrl && (
                  <img
                    src={qrCode.imageUrl}
                    alt="QR Code"
                    className="w-full mb-4 border rounded"
                  />
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={qrCode.url} target="_blank">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  asChild
                >
                  <Link href={`/dashboard/qr/${qrCode.code}/analytics`}>
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

