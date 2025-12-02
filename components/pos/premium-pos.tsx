"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, X, Search } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface PremiumPOSProps {
  restaurantId: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string[]
}

export function PremiumPOS({ restaurantId }: PremiumPOSProps) {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    fetchMenuItems()
  }, [restaurantId])

  const fetchMenuItems = async () => {
    // Mock data - replace with actual API call
    setMenuItems([
      {
        id: "1",
        name: "Margherita Pizza",
        price: 112.99,
        image: [],
        category: { id: "cat1", name: "Pizza" },
        isAvailable: true,
      },
      {
        id: "2",
        name: "Pepperoni Pizza",
        price: 140.99,
        image: [],
        category: { id: "cat1", name: "Pizza" },
        isAvailable: true,
      },
      {
        id: "3",
        name: "Caesar Salad",
        price: 800.99,
        image: [],
        category: { id: "cat2", name: "Salads" },
        isAvailable: true,
      },
    ])
  }

  const addToCart = (item: any) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const categories = Array.from(new Set(menuItems.map((item) => item.category?.name))).filter(Boolean)

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = !selectedCategory || item.category?.name === selectedCategory
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && item.isAvailable
  })

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Main Menu Area */}
      <div className="flex-1 flex flex-col">
        {/* Search and Categories */}
        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C97AFF] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`${!selectedCategory ? "bg-[#FCD34D] text-[#0D0D0D]" : "text-gray-400 hover:text-white"}`}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category as string)}
                className={`${selectedCategory === category ? "bg-[#FCD34D] text-[#0D0D0D]" : "text-gray-400 hover:text-white"}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card
                    className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow hover:shadow-glow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
                    onClick={() => addToCart(item)}
                  >
                    <div className="relative h-32 bg-[#0D0D0D]">
                      {item.image && item.image.length > 0 ? (
                        <Image
                          src={item.image[0]}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">🍕</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-[#11C97A] font-bold text-sm">{formatCurrency(item.price)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 flex flex-col">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow flex-1 flex flex-col">
          <CardHeader className="border-b border-[#2A2A2A]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCart([])}
                  className="text-gray-400 hover:text-red-400"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-gray-600 mb-4" />
                <p className="text-gray-400">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-2">Add items to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-3 rounded-[12px] bg-[#0D0D0D] border border-[#2A2A2A]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{item.name}</p>
                          <p className="text-[#11C97A] font-bold text-sm mt-1">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-6 w-6 text-gray-400 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-8 w-8 bg-[#2A2A2A] hover:bg-[#2A2A2A]/80"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="flex-1 text-center font-semibold text-white">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-8 w-8 bg-[#2A2A2A] hover:bg-[#2A2A2A]/80"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
          {cart.length > 0 && (
            <div className="p-4 border-t border-[#2A2A2A] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-semibold">{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tax (10%)</span>
                <span className="text-white font-semibold">{formatCurrency(total * 0.1)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-[#11C97A]">{formatCurrency(total * 1.1)}</span>
              </div>
              <Button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0 h-12 text-lg font-semibold shadow-glow"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Checkout
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          restaurantId={restaurantId}
          total={total * 1.1}
          onClose={() => setShowPaymentModal(false)}
          onComplete={() => {
            setShowPaymentModal(false)
            setCart([])
          }}
        />
      )}
    </div>
  )
}

function PaymentModal({ restaurantId, total, onClose, onComplete }: { restaurantId: string; total: number; onClose: () => void; onComplete: () => void }) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const paymentMethods = [
    { id: "cash", name: "Cash", icon: "💵", method: "CASH" },
    { id: "card", name: "Card / UPI", icon: "💳", method: "UPI" },
    { id: "digital", name: "Digital Wallet", icon: "📱", method: "WALLET" },
  ]

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment gateway is loading. Please wait a moment.")
      return
    }

    setProcessing(true)
    try {
      // Create Razorpay order
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          restaurantId,
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
        name: "RestoDrive",
        description: "Restaurant Payment",
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
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            alert("Payment successful!")
            onComplete()
          } else {
            alert("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#C97AFF",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false)
          },
        },
      }

      const razorpay = (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error("Payment error:", error)
      alert(error.message || "Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  const handleCashPayment = async () => {
    setProcessing(true)
    try {
      // For cash payments, mark as completed immediately
      // You can create a payment record here if needed
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate processing
      onComplete()
    } catch (error) {
      console.error("Cash payment error:", error)
      alert("Failed to process cash payment")
    } finally {
      setProcessing(false)
    }
  }

  const handlePayment = () => {
    if (selectedMethod === "cash") {
      handleCashPayment()
    } else if (selectedMethod === "card" || selectedMethod === "digital") {
      handleRazorpayPayment()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[22px] shadow-glow-lg w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Payment</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-gray-400 mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-[#11C97A]">{formatCurrency(total)}</p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-gray-400">Payment Method</p>
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-[12px] border-2 transition-all ${
                  selectedMethod === method.id
                    ? "bg-[#C97AFF]/20 border-[#C97AFF] text-white"
                    : "bg-[#0D0D0D] border-[#2A2A2A] text-gray-400 hover:border-[#2A2A2A]/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-semibold">{method.name}</span>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || processing}
            className="w-full bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0 h-12 text-lg font-semibold disabled:opacity-50"
          >
            {processing ? "Processing..." : "Complete Payment"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

