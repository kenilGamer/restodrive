"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, CreditCard, MapPin, User, Phone, Mail, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cart: any[]
  restaurantId: string
  restaurantName: string
  currency?: string
  onOrderComplete: (orderId: string) => void
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  restaurantId,
  restaurantName,
  currency = "INR",
  onOrderComplete,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"details" | "payment" | "success">("details")
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    specialInstructions: "",
  })

  useEffect(() => {
    if (isOpen && step === "payment") {
      // Load Razorpay script
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => setRazorpayLoaded(true)
      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [isOpen, step])

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )
  const tax = cartTotal * 0.18 // 18% GST
  const deliveryFee = cartTotal > 500 ? 0 : 50 // Free delivery above ₹500
  const total = cartTotal + tax + deliveryFee

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      alert("Please fill in all required fields")
      return
    }

    // Create order first
    setLoading(true)
    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          type: "ONLINE",
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail || undefined,
          customerAddress: formData.deliveryAddress || undefined,
          specialInstructions: formData.specialInstructions || undefined,
          items: cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            variantId: item.variantId || undefined,
            modifiers: item.modifiers?.map((m: any) => m.id) || [],
            specialInstructions: item.specialInstructions || undefined,
          })),
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order")
      }

      setOrderId(orderData.order.id)
      setStep("payment")
    } catch (error: any) {
      console.error("Error creating order:", error)
      alert(error.message || "Failed to create order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment gateway is loading. Please wait a moment.")
      return
    }

    if (!orderId) {
      alert("Order not found. Please try again.")
      return
    }

    setLoading(true)
    try {
      // Create Razorpay order
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency,
          orderId,
          restaurantId,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment order")
      }

      // Initialize Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: restaurantName,
        description: `Order #${orderId}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: total,
              restaurantId,
              orderId,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            setStep("success")
            setTimeout(() => {
              onOrderComplete(orderId)
              onClose()
            }, 3000)
          } else {
            alert("Payment verification failed. Please contact support.")
            setLoading(false)
          }
        },
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail || "customer@example.com",
          contact: formData.customerPhone,
        },
        theme: {
          color: "#06b6d4", // Cyan color matching the theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const razorpay = (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error("Payment error:", error)
      alert(error.message || "Payment failed. Please try again.")
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[22px] shadow-glow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-orbitron font-bold text-white">
              {step === "details" && "Checkout"}
              {step === "payment" && "Payment"}
              {step === "success" && "Order Confirmed!"}
            </h2>
            {step !== "success" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Step Indicator */}
          {step !== "success" && (
            <div className="flex items-center justify-center mb-8 gap-4">
              <div
                className={`flex items-center gap-2 ${
                  step === "details" ? "text-cyan-400" : "text-green-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "details"
                      ? "bg-cyan-500/20 border-2 border-cyan-500"
                      : "bg-green-500/20 border-2 border-green-500"
                  }`}
                >
                  {step === "details" ? "1" : "✓"}
                </div>
                <span className="text-sm font-medium">Details</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-700"></div>
              <div
                className={`flex items-center gap-2 ${
                  step === "payment" ? "text-cyan-400" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "payment"
                      ? "bg-cyan-500/20 border-2 border-cyan-500"
                      : "bg-gray-800 border-2 border-gray-700"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
          )}

          {/* Details Step */}
          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Delivery Address (Optional)
                </label>
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryAddress: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Enter your delivery address..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialInstructions: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              {/* Order Summary */}
              <Card className="bg-[#0D0D0D] border-[#2A2A2A]">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartTotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (18%)</span>
                    <span>{formatCurrency(tax, currency)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Delivery Fee</span>
                      <span>{formatCurrency(deliveryFee, currency)}</span>
                    </div>
                  )}
                  <div className="border-t border-[#2A2A2A] pt-2 flex justify-between">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-cyan-400">
                      {formatCurrency(total, currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 h-12 text-lg font-semibold shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  Complete your payment to confirm your order
                </p>
                <div className="text-3xl font-orbitron font-bold text-cyan-400 mb-2">
                  {formatCurrency(total, currency)}
                </div>
                <p className="text-sm text-gray-500">Order #{orderId}</p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading || !razorpayLoaded}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 h-12 text-lg font-semibold shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Loading Payment Gateway...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay with Razorpay
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mb-6"
              >
                <svg
                  className="w-10 h-10 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
                Order Confirmed!
              </h3>
              <p className="text-gray-400 mb-4">
                Your order #{orderId} has been placed successfully.
              </p>
              <p className="text-sm text-gray-500">
                You will receive a confirmation message shortly.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

