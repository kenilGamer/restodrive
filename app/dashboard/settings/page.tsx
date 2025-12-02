import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Bell, CreditCard, Shield, Building2, User } from "lucide-react"
import { SlugDisplay } from "@/components/settings/slug-display"
import { RestaurantSettingsForm } from "@/components/settings/restaurant-settings-form"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const restaurants = await db.restaurant.findMany({
    where: { ownerId: session.user.id },
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
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage your restaurant settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[12px] p-1">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            <User className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="restaurant"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Restaurant
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#FCD34D] data-[state=active]:text-[#0D0D0D] text-gray-400"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account and general preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-400">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={session.user.name || ""}
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-400">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={session.user.email || ""}
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                  disabled
                />
              </div>
              <Button className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurant" className="mt-6">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">Restaurant Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your restaurant details and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SlugDisplay slug={restaurant.slug} />
              <div className="mt-6">
                <RestaurantSettingsForm restaurant={restaurant} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">Payment Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure payment gateways and methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Payment gateway integration coming soon. Connect Stripe, Razorpay, and other payment providers.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">Notification Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage email and SMS notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Notification preferences coming soon. Configure email and SMS alerts for orders, bookings, and more.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-400">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-400">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-400">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                />
              </div>
              <Button className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0">
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
