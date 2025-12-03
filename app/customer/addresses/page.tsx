import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddressList } from "@/components/customer/address-list"

export default async function CustomerAddressesPage() {
  const session = await getServerSession(customerAuthOptions)

  if (!session?.user?.id) {
    redirect("/customer/login")
  }

  const addresses = await db.customerAddress.findMany({
    where: { customerId: session.user.id },
    orderBy: [
      { isDefault: "desc" },
      { createdAt: "desc" },
    ],
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Address Book</h1>
        <p className="text-gray-500 mt-2">Manage your delivery addresses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
          <CardDescription>Add, edit, or remove addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <AddressList addresses={addresses} />
        </CardContent>
      </Card>
    </div>
  )
}

