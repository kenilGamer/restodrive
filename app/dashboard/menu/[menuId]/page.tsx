import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { PremiumMenuEditor } from "@/components/menu/premium-menu-editor"

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
      restaurant: {
        select: {
          slug: true,
        },
      },
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

  // Serialize Decimal fields to numbers for Client Component
  // Prisma Decimal objects cannot be serialized to Client Components
  const serializedMenu = {
    ...menu,
    categories: menu.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        price: Number(item.price),
        variants: item.variants.map((variant) => ({
          ...variant,
          price: Number(variant.price),
        })),
        modifiers: item.modifiers.map((modifier) => ({
          ...modifier,
          price: Number(modifier.price),
        })),
      })),
    })),
  } as any // Type assertion needed because we're converting Decimal to number

  return <PremiumMenuEditor menu={serializedMenu} restaurantSlug={menu.restaurant.slug} />
}

