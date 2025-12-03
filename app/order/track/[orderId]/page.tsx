import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { OrderTrackingView } from "@/components/ordering/order-tracking-view"

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  const order = await db.order.findUnique({
    where: { id: orderId },
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
      restaurant: {
        select: {
          id: true,
          slug: true,
          name: true,
          logo: true,
          phone: true,
          email: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  })

  if (!order) {
    notFound()
  }

  return <OrderTrackingView order={order} />
}

