import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { QRCodeAnalytics } from "@/components/qr/qr-code-analytics"

export default async function QRCodeAnalyticsPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const session = await getServerSession(authOptions)
  const { code } = await params

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Verify QR code belongs to user's restaurant
  const qrCode = await db.qRCode.findFirst({
    where: {
      code,
      restaurant: {
        ownerId: session.user.id,
      },
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!qrCode) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">QR Code Not Found</h1>
          <p className="text-gray-400">The QR code you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-white">QR Code Analytics</h1>
        <p className="mt-2 text-sm text-gray-400">
          Track scans and performance for QR code: <span className="text-cyan-400 font-mono">{code}</span>
        </p>
      </div>

      <QRCodeAnalytics qrCodeId={qrCode.id} code={code} />
    </div>
  )
}

