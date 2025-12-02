import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { MenuEditor } from "@/components/menu/menu-editor"

export default async function MenuEditPage({
  params,
}: {
  params: Promise<{ menuId: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const { menuId } = await params

  const menu = await db.menu.findFirst({
    where: {
      id: menuId,
      restaurant: {
        ownerId: session.user.id,
      },
    },
    include: {
      categories: {
        include: {
          items: {
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
  })

  if (!menu) {
    redirect("/dashboard/menu")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{menu.name}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Build your menu by adding categories and items
        </p>
      </div>

      <MenuEditor menu={menu} />
    </div>
  )
}

