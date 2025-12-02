import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { MenuCard } from "@/components/menu/menu-card"

export default async function MenuPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const restaurants = await db.restaurant.findMany({
    where: { ownerId: session.user.id },
    include: {
      menus: {
        include: {
          _count: {
            select: {
              categories: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-white">Menu Builder</h1>
          <p className="mt-2 text-sm text-gray-400">
            Create and manage your digital menus
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Menu URL: <span className="text-cyan-400 font-mono">/qr/{restaurant.slug}</span>
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0 shadow-glow"
        >
          <Link href="/dashboard/menu/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Menu
          </Link>
        </Button>
      </div>

      {restaurant.menus.length === 0 ? (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardHeader>
            <CardTitle className="text-white">No Menus Yet</CardTitle>
            <CardDescription className="text-gray-400">
              Create your first menu to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0"
            >
              <Link href="/dashboard/menu/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Menu
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurant.menus.map((menu, index) => {
            if (!restaurant.slug) {
              console.error("Restaurant slug is missing for restaurant:", restaurant.id, restaurant.name)
            }
            return (
              <MenuCard 
                key={menu.id} 
                menu={menu} 
                index={index} 
                restaurantSlug={restaurant.slug || ''} 
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
