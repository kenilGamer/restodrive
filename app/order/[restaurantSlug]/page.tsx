import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { CustomerOrderingFlow } from "@/components/ordering/customer-ordering-flow"
import { serializeRestaurantWithMenus } from "@/lib/utils/serialize"

export default async function CustomerOrderingPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>
}) {
  const { restaurantSlug } = await params

  if (!restaurantSlug || restaurantSlug.trim() === "") {
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
    },
  })

  if (!restaurant) {
    notFound()
  }

  if (!restaurant.menus.length) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Menu Coming Soon
          </h1>
          <p className="text-gray-400">
            {restaurant.name} is setting up their menu.
          </p>
        </div>
      </div>
    )
  }

  const menu = restaurant.menus[0]

  // Serialize Decimal fields to numbers for Client Component
  // Prisma Decimal objects cannot be serialized to Client Components
  const serializedRestaurant = serializeRestaurantWithMenus(restaurant)
  const serializedMenu = serializedRestaurant.menus[0]

  return (
    <CustomerOrderingFlow restaurant={serializedRestaurant} menu={serializedMenu} />
  )
}

