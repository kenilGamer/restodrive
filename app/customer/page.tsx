import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { redirect } from "next/navigation"

export default async function CustomerPage() {
  const session = await getServerSession(customerAuthOptions)

  if (!session?.user?.id) {
    redirect("/customer/login")
  }

  // Redirect authenticated customers to dashboard
  redirect("/customer/dashboard")
}
