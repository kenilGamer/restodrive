import { getServerSession } from "next-auth"
import { customerAuthOptions } from "@/lib/auth-customer"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, Heart, MapPin, LogOut } from "lucide-react"
import { PointsDisplay } from "@/components/loyalty/points-display"
import { SessionProvider } from "@/components/providers/session-provider"

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(customerAuthOptions)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/customer" className="text-2xl font-bold">
              RestoDrive
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/customer/dashboard"
                className="text-sm font-medium hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/customer/orders"
                className="text-sm font-medium hover:text-primary"
              >
                Orders
              </Link>
              <Link
                href="/customer/favorites"
                className="text-sm font-medium hover:text-primary"
              >
                Favorites
              </Link>
              <Link
                href="/customer/addresses"
                className="text-sm font-medium hover:text-primary"
              >
                Addresses
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {session?.user ? (
                <>
                  <PointsDisplay />
                  <Link href="/customer/profile">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/customer/logout">
                    <Button variant="ghost" size="icon">
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/customer/login">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SessionProvider session={session} basePath="/api/auth/customer">
          {children}
        </SessionProvider>
      </main>
    </div>
  )
}

