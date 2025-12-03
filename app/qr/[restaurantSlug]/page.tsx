import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { QRMenuView } from "@/components/qr/menu-view"
import { AlertCircle } from "lucide-react"
import { serializeRestaurantWithMenus } from "@/lib/utils/serialize"

export default async function QRMenuPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>
}) {
  const { restaurantSlug } = await params

  // Debug: Log the slug being searched
  console.log("QR Menu Page: Looking for restaurant with slug:", restaurantSlug)

  if (!restaurantSlug || restaurantSlug.trim() === '') {
    console.error("QR Menu Page: Invalid restaurant slug:", restaurantSlug)
    notFound()
  }

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

  if (!restaurant) {
    notFound()
  }

  if (!restaurant.menus.length) {
    // Restaurant exists but has no active menus
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-8">
            <AlertCircle className="h-10 w-10 text-yellow-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
            Menu Coming Soon
          </h1>
          
          <p className="text-xl text-gray-400 mb-2">
            {restaurant.name} is setting up their menu.
          </p>
          <p className="text-lg text-gray-500">
            Please check back soon!
          </p>
        </div>
      </div>
    )
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

  // Serialize Decimal fields to numbers for Client Component
  // Prisma Decimal objects cannot be serialized to Client Components
  const serializedRestaurant = serializeRestaurantWithMenus(restaurant)
  const serializedMenu = serializedRestaurant.menus[0]

  // Debug: Log menu structure (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Menu categories count:', serializedMenu?.categories?.length)
    serializedMenu?.categories?.forEach((cat, idx) => {
      console.log(`Category ${idx}: ${cat.name}, items: ${cat.items?.length || 0}`)
    })
  }

  return (
    <QRMenuView restaurant={serializedRestaurant} menu={serializedMenu} />
  )
}

