import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { OrderDetailView } from "@/components/orders/order-detail-view"

// Cache for 10 seconds - order details need near real-time updates
export const revalidate = 10

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const { orderId } = await params

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      restaurant: {
        ownerId: session.user.id,
      },
    },
    include: {
      items: {
        include: {
          menuItem: {
            include: {
              category: true,
            },
          },
          variant: true,
          modifiers: true,
        },
      },
      payments: true,
      table: true,
      restaurant: true,
    },
  })

  if (!order) {
    redirect("/dashboard/orders")
  }

  return <OrderDetailView order={order} />
}

