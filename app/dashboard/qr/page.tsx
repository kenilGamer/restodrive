import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, TrendingUp, Scan } from "lucide-react"
import { QRGenerator } from "@/components/qr/qr-generator"
import { QRCodeCard } from "@/components/qr/qr-code-card"

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
        orderBy: {
          createdAt: "desc",
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
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardHeader>
            <CardTitle className="text-white">No Restaurant Found</CardTitle>
            <CardDescription className="text-gray-400">
              Please create a restaurant first.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const totalScans = restaurant.qrCodes.reduce((sum, qr) => sum + qr._count.scans, 0)

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-white">QR Menus</h1>
        <p className="mt-2 text-sm text-gray-400">
          Generate and manage QR codes for your digital menus
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total QR Codes</p>
                <p className="text-2xl font-bold text-white">{restaurant.qrCodes.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#C97AFF]/20 flex items-center justify-center">
                <QrCode className="h-6 w-6 text-[#C97AFF]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Scans</p>
                <p className="text-2xl font-bold text-white">{totalScans}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#11C97A]/20 flex items-center justify-center">
                <Scan className="h-6 w-6 text-[#11C97A]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg. Scans/Code</p>
                <p className="text-2xl font-bold text-white">
                  {restaurant.qrCodes.length > 0
                    ? Math.round(totalScans / restaurant.qrCodes.length)
                    : 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#6B7CFF]/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#6B7CFF]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {restaurant.qrCodes.length === 0 ? (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardHeader>
            <CardTitle className="text-white">No QR Codes Yet</CardTitle>
            <CardDescription className="text-gray-400">
              Generate your first QR code to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRGenerator restaurantId={restaurant.id} />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Your QR Codes</h2>
            <QRGenerator restaurantId={restaurant.id} />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurant.qrCodes.map((qrCode, index) => (
              <QRCodeCard key={qrCode.id} qrCode={qrCode} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
