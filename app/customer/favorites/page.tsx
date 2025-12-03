import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { Heart } from "lucide-react"

export default async function CustomerFavoritesPage() {
  const session = await getServerSession(customerAuthOptions)

  if (!session?.user?.id) {
    redirect("/customer/login")
  }

  const favorites = await db.favoriteItem.findMany({
    where: { customerId: session.user.id },
    include: {
      menuItem: {
        include: {
          category: true,
        },
      },
      restaurant: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Favorite Items</h1>
        <p className="text-gray-500 mt-2">Your saved favorite menu items</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">No favorite items yet</p>
            <Link href="/order">
              <button className="px-4 py-2 bg-primary text-white rounded-lg">
                Browse Menu
              </button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite) => (
            <Link
              key={favorite.id}
              href={`/order/${favorite.restaurant.slug}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {favorite.menuItem.image && favorite.menuItem.image.length > 0 && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={favorite.menuItem.image[0]}
                        alt={favorite.menuItem.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{favorite.menuItem.name}</h3>
                      <Heart className="h-5 w-5 fill-red-500 text-red-500 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {favorite.restaurant.name}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {favorite.menuItem.category.name}
                    </p>
                    <p className="font-semibold">
                      {formatCurrency(Number(favorite.menuItem.price))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

