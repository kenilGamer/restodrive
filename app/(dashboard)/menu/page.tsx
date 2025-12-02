import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Menu Builder</h1>
          <p className="mt-2 text-sm text-white">
            Create and manage your digital menus
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/menu/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Menu
          </Link>
        </Button>
      </div>

      {restaurant.menus.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Menus Yet</CardTitle>
            <CardDescription>
              Create your first menu to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/menu/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Menu
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurant.menus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{menu.name}</CardTitle>
                  {menu.isActive && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </div>
                <CardDescription>
                  Version {menu.version} • {menu._count.categories} categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/menu/${menu.id}`}>Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

