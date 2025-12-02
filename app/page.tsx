import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, QrCode, ShoppingCart, Calendar, BarChart3 } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  const features = [
    {
      name: "Digital Menu Builder",
      description: "Create beautiful menus with drag-and-drop simplicity",
      icon: UtensilsCrossed,
    },
    {
      name: "QR Code Menus",
      description: "Generate branded QR codes for contactless dining",
      icon: QrCode,
    },
    {
      name: "Online Ordering",
      description: "Accept and manage orders with real-time tracking",
      icon: ShoppingCart,
    },
    {
      name: "Table Bookings",
      description: "Streamline reservations with automated reminders",
      icon: Calendar,
    },
    {
      name: "Business Analytics",
      description: "Track sales, popular items, and customer behavior",
      icon: BarChart3,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">RestoDrive</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Run Your Entire Restaurant
            <br />
            <span className="text-primary">from One Platform</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Create stunning QR menus, accept online orders, manage table bookings, and track your business—all in one place. Join thousands of restaurants already digitizing their operations.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/register">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ✓ No credit card required • ✓ 14-day free trial • ✓ Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything Your Restaurant Needs
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            One platform. One price. Infinite possibilities.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{feature.name}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Start your free trial today. No credit card required.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 RestoDrive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
