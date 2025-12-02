import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { QRMenuView } from "@/components/qr/menu-view"

export default async function QRMenuPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>
}) {
  const { restaurantSlug } = await params

  const restaurant = await db.restaurant.findUnique({
    where: { slug: restaurantSlug },
    include: {
      menus: {
        where: { isActive: true },
        include: {
          categories: {
            where: { isActive: true },
            include: {
              items: {
                where: { isAvailable: true },
                include: {
                  variants: true,
                  modifiers: true,
                },
              },
            },
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
        take: 1,
      },
      qrCodes: {
        take: 1,
      },
    },
  })

  if (!restaurant || !restaurant.menus.length) {
    notFound()
  }

  const menu = restaurant.menus[0]

  // Track QR scan (async, don't block page render)
  if (restaurant.qrCodes && restaurant.qrCodes.length > 0) {
    // Track scan in background
    db.qRScan.create({
      data: {
        qrCodeId: restaurant.qrCodes[0].id,
        ipAddress: "unknown", // Will be tracked via API route if needed
      },
    }).catch(console.error)

    db.qRCode.update({
      where: { id: restaurant.qrCodes[0].id },
      data: {
        scanCount: { increment: 1 },
        lastScannedAt: new Date(),
      },
    }).catch(console.error)
  }

  return (
    <QRMenuView restaurant={restaurant} menu={menu} />
  )
}

