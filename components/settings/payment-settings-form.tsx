"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, CheckCircle2, XCircle, CreditCard, AlertCircle, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface PaymentSettingsFormProps {
  restaurantId: string
}

export function PaymentSettingsForm({ restaurantId }: PaymentSettingsFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [razorpayStatus, setRazorpayStatus] = useState<"connected" | "disconnected" | "testing" | null>(null)
  
  // Check if user is admin/owner
  const isAdmin = session?.user?.role === "OWNER"
  
  const [formData, setFormData] = useState({
    razorpayKeyId: "",
    razorpayKeySecret: "",
    enableRazorpay: true,
    enableStripe: false,
    stripePublishableKey: "",
    stripeSecretKey: "",
    enableUPI: true,
    enableCard: true,
    enableNetBanking: true,
    enableWallet: true,
    enableCOD: true,
  })

  useEffect(() => {
    // Check if Razorpay is configured from environment or fetch from API
    checkPaymentStatus()
  }, [])

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/config?restaurantId=${restaurantId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.razorpayConfigured) {
          setRazorpayStatus("connected")
        } else {
          setRazorpayStatus("disconnected")
        }
        // Don't show actual keys, just status
      }
    } catch (error) {
      console.error("Error checking payment status:", error)
      setRazorpayStatus("disconnected")
    }
  }

  const testRazorpayConnection = async () => {
    setTesting(true)
    setRazorpayStatus("testing")
    
    try {
      const response = await fetch("/api/payments/test-razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyId: formData.razorpayKeyId,
          keySecret: formData.razorpayKeySecret,
        }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setRazorpayStatus("connected")
        alert("Razorpay connection successful!")
      } else {
        setRazorpayStatus("disconnected")
        alert(data.error || "Failed to connect to Razorpay. Please check your credentials.")
      }
    } catch (error) {
      setRazorpayStatus("disconnected")
      alert("Failed to test Razorpay connection")
    } finally {
      setTesting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/payments/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          razorpayKeyId: formData.razorpayKeyId || undefined,
          razorpayKeySecret: formData.razorpayKeySecret || undefined,
          enableRazorpay: formData.enableRazorpay,
          enableStripe: formData.enableStripe,
          stripePublishableKey: formData.stripePublishableKey || undefined,
          stripeSecretKey: formData.stripeSecretKey || undefined,
          paymentMethods: {
            upi: formData.enableUPI,
            card: formData.enableCard,
            netBanking: formData.enableNetBanking,
            wallet: formData.enableWallet,
            cod: formData.enableCOD,
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
        alert("Payment settings saved successfully!")
        checkPaymentStatus()
      } else {
        alert(data.error || "Failed to save payment settings")
      }
    } catch (error) {
      console.error("Error saving payment settings:", error)
      alert("Failed to save payment settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Razorpay Configuration */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-cyan-400" />
                Razorpay
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure Razorpay payment gateway for Indian customers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {razorpayStatus === "connected" && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              )}
              {razorpayStatus === "disconnected" && (
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Not Connected</span>
                </div>
              )}
              {razorpayStatus === "testing" && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                  <span className="text-sm font-medium">Testing...</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <p className="text-sm text-amber-200 font-semibold">Security Best Practices</p>
              <ul className="text-sm text-amber-300/90 leading-relaxed space-y-1 list-disc list-inside">
                <li>Secret keys are masked and never displayed after entry</li>
                <li>Store keys in environment variables for production</li>
                <li>Never commit payment keys to version control</li>
                <li>Use a secrets management service for enterprise deployments</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="razorpayKeyId" className="text-gray-400">
                Razorpay Key ID
              </Label>
              <Input
                id="razorpayKeyId"
                type="text"
                value={formData.razorpayKeyId}
                onChange={(e) => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                placeholder="rzp_test_..."
                className="bg-[#0D0D0D] border-[#2A2A2A] text-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="razorpayKeySecret" className="text-gray-400">
                Razorpay Key Secret
              </Label>
              <Input
                id="razorpayKeySecret"
                type="password"
                value={formData.razorpayKeySecret}
                onChange={(e) => setFormData({ ...formData, razorpayKeySecret: e.target.value })}
                placeholder="Enter your secret key"
                className="bg-[#0D0D0D] border-[#2A2A2A] text-white font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableRazorpay"
                checked={formData.enableRazorpay}
                onChange={(e) => setFormData({ ...formData, enableRazorpay: e.target.checked })}
                className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#C97AFF] focus:ring-[#C97AFF]"
              />
              <Label htmlFor="enableRazorpay" className="text-gray-300 cursor-pointer">
                Enable Razorpay payments
              </Label>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={testRazorpayConnection}
                disabled={testing || !formData.razorpayKeyId || !formData.razorpayKeySecret}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                {testing ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Configuration (Coming Soon) */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] opacity-60">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-500" />
            Stripe
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Coming Soon</span>
          </CardTitle>
          <CardDescription className="text-gray-500">
            Stripe integration for international payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Stripe integration will be available in a future update. For now, use Razorpay for payment processing.
          </p>
        </CardContent>
      </Card>

      {/* Payment Methods - Admin Only */}
      {isAdmin ? (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white">Payment Methods</CardTitle>
            <CardDescription className="text-gray-400">
              Enable or disable specific payment methods for your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <input
                  type="checkbox"
                  id="enableUPI"
                  checked={formData.enableUPI}
                  onChange={(e) => setFormData({ ...formData, enableUPI: e.target.checked })}
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#C97AFF] focus:ring-[#C97AFF]"
                />
                <Label htmlFor="enableUPI" className="text-gray-300 cursor-pointer flex-1">
                  UPI
                </Label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <input
                  type="checkbox"
                  id="enableCard"
                  checked={formData.enableCard}
                  onChange={(e) => setFormData({ ...formData, enableCard: e.target.checked })}
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#C97AFF] focus:ring-[#C97AFF]"
                />
                <Label htmlFor="enableCard" className="text-gray-300 cursor-pointer flex-1">
                  Credit/Debit Cards
                </Label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <input
                  type="checkbox"
                  id="enableNetBanking"
                  checked={formData.enableNetBanking}
                  onChange={(e) => setFormData({ ...formData, enableNetBanking: e.target.checked })}
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#C97AFF] focus:ring-[#C97AFF]"
                />
                <Label htmlFor="enableNetBanking" className="text-gray-300 cursor-pointer flex-1">
                  Net Banking
                </Label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <input
                  type="checkbox"
                  id="enableWallet"
                  checked={formData.enableWallet}
                  onChange={(e) => setFormData({ ...formData, enableWallet: e.target.checked })}
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#C97AFF] focus:ring-[#C97AFF]"
                />
                <Label htmlFor="enableWallet" className="text-gray-300 cursor-pointer flex-1">
                  Wallets (Paytm, PhonePe, etc.)
                </Label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <input
                  type="checkbox"
                  id="enableCOD"
                  checked={formData.enableCOD}
                  onChange={(e) => setFormData({ ...formData, enableCOD: e.target.checked })}
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#C97AFF] focus:ring-[#C97AFF]"
                />
                <Label htmlFor="enableCOD" className="text-gray-300 cursor-pointer flex-1">
                  Cash on Delivery (COD)
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Payment Settings"}
            </Button>
          </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Admin Access Required</h3>
            <p className="text-gray-400">
              Only restaurant owners can configure payment methods. Please contact your administrator for access.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

