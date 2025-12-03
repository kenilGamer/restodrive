"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Package,
  Truck,
  Home,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface OrderTrackingViewProps {
  order: {
    id: string
    orderNumber: string
    status: string
    paymentStatus: string
    total: number | string
    createdAt: Date
    estimatedDeliveryTime: Date | null
    customerName: string | null
    customerPhone: string | null
    customerEmail: string | null
    customerAddress: string | null
    specialInstructions: string | null
    restaurant: {
      id: string
      slug: string
      name: string
      logo: string | null
      phone: string | null
      email: string | null
    }
    items: Array<{
      id: string
      quantity: number
      price: number | string
      menuItem: {
        id: string
        name: string
        image: string[]
      }
      variant: {
        name: string
      } | null
      modifiers: Array<{
        name: string
        price: number | string
      }>
    }>
    payments: Array<{
      id: string
      status: string
      method: string
      amount: number | string
    }>
  }
}

const orderStatusSteps = [
  { key: "PENDING", label: "Order Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PREPARING", label: "Preparing", icon: ChefHat },
  { key: "READY", label: "Ready", icon: Package },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Home },
]

export function OrderTrackingView({ order }: OrderTrackingViewProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)

  // Theme detection
  useEffect(() => {
    const savedTheme = localStorage.getItem("order-theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("order-theme", theme)
  }, [theme])

  useEffect(() => {
    const index = orderStatusSteps.findIndex((step) => step.key === order.status)
    setCurrentStatusIndex(index >= 0 ? index : 0)
  }, [order.status])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const isDark = theme === "dark"
  const payment = order.payments[0]
  const orderTotal = Number(order.total)

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      {/* Background */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${
          isDark
            ? "bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"
            : "bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"
        }`}
      ></div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark
            ? "bg-black/80 border-white/10"
            : "bg-white/80 border-gray-200/50"
        }`}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className={`transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {order.restaurant.logo && (
                <div
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border transition-colors ${
                    isDark ? "border-cyan-500/30" : "border-cyan-400/40"
                  }`}
                >
                  <Image
                    src={order.restaurant.logo}
                    alt={order.restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h1
                  className={`text-xl font-bold transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Order Tracking
                </h1>
                <p
                  className={`text-sm transition-colors ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {order.restaurant.name}
                </p>
              </div>
            </div>
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className={`transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header Card */}
        <Card
          className={`mb-6 transition-colors ${
            isDark
              ? "bg-black/50 border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle
                  className={`text-2xl font-bold mb-2 transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Order #{order.orderNumber}
                </CardTitle>
                <p
                  className={`text-sm transition-colors ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-2xl font-bold mb-1 transition-colors ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                      : "text-cyan-600"
                  }`}
                >
                  {formatCurrency(orderTotal, "INR")}
                </p>
                <span
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    order.paymentStatus === "COMPLETED"
                      ? isDark
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-green-100 text-green-700 border border-green-200"
                      : isDark
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {order.paymentStatus === "COMPLETED" ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Timeline */}
        <Card
          className={`mb-6 transition-colors ${
            isDark ? "bg-black/50 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`transition-colors ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orderStatusSteps.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = index < currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const isPending = index > currentStatusIndex

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? isDark
                            ? "bg-green-500/20 border-2 border-green-500"
                            : "bg-green-100 border-2 border-green-500"
                          : isCurrent
                            ? isDark
                              ? "bg-cyan-500/20 border-2 border-cyan-500 animate-pulse"
                              : "bg-cyan-100 border-2 border-cyan-500 animate-pulse"
                            : isDark
                              ? "bg-gray-800 border-2 border-gray-700"
                              : "bg-gray-100 border-2 border-gray-300"
                      }`}
                    >
                      <StepIcon
                        className={`h-6 w-6 transition-colors ${
                          isCompleted
                            ? "text-green-400"
                            : isCurrent
                              ? "text-cyan-400"
                              : isDark
                                ? "text-gray-600"
                                : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 pt-2">
                      <h3
                        className={`font-semibold mb-1 transition-colors ${
                          isCompleted || isCurrent
                            ? isDark
                              ? "text-white"
                              : "text-gray-900"
                            : isDark
                              ? "text-gray-500"
                              : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </h3>
                      {isCurrent && (
                        <p
                          className={`text-sm transition-colors ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Your order is currently being processed
                        </p>
                      )}
                      {isPending && (
                        <p
                          className={`text-sm transition-colors ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Upcoming
                        </p>
                      )}
                    </div>
                    {index < orderStatusSteps.length - 1 && (
                      <div
                        className={`absolute left-6 w-0.5 h-12 transition-colors ${
                          isCompleted
                            ? "bg-green-500"
                            : isDark
                              ? "bg-gray-700"
                              : "bg-gray-300"
                        }`}
                        style={{ marginTop: "3rem" }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card
          className={`mb-6 transition-colors ${
            isDark ? "bg-black/50 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`transition-colors ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    isDark
                      ? "bg-white/5 border border-white/10"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  {item.menuItem.image && item.menuItem.image.length > 0 && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.menuItem.image[0]}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4
                      className={`font-semibold mb-1 transition-colors ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.menuItem.name}
                    </h4>
                    {item.variant && (
                      <p
                        className={`text-sm transition-colors ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {item.variant.name}
                      </p>
                    )}
                    {item.modifiers.length > 0 && (
                      <p
                        className={`text-xs transition-colors ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        + {item.modifiers.map((m) => m.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold transition-colors ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Qty: {item.quantity}
                    </p>
                    <p
                      className={`text-sm transition-colors ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {formatCurrency(
                        Number(item.price) * item.quantity,
                        "INR"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        {(order.customerName || order.customerPhone || order.customerAddress) && (
          <Card
            className={`mb-6 transition-colors ${
              isDark ? "bg-black/50 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.customerName && (
                <p
                  className={`transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span
                    className={`font-medium transition-colors ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Name:
                  </span>{" "}
                  {order.customerName}
                </p>
              )}
              {order.customerPhone && (
                <p
                  className={`transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span
                    className={`font-medium transition-colors ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Phone:
                  </span>{" "}
                  {order.customerPhone}
                </p>
              )}
              {order.customerAddress && (
                <p
                  className={`transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span
                    className={`font-medium transition-colors ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Address:
                  </span>{" "}
                  {order.customerAddress}
                </p>
              )}
              {order.specialInstructions && (
                <p
                  className={`transition-colors ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span
                    className={`font-medium transition-colors ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Special Instructions:
                  </span>{" "}
                  {order.specialInstructions}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Estimated Delivery */}
        {order.estimatedDeliveryTime && (
          <Card
            className={`mb-6 transition-colors ${
              isDark ? "bg-black/50 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock
                  className={`h-6 w-6 transition-colors ${
                    isDark ? "text-cyan-400" : "text-cyan-600"
                  }`}
                />
                <div>
                  <p
                    className={`font-semibold mb-1 transition-colors ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Estimated Delivery Time
                  </p>
                  <p
                    className={`text-sm transition-colors ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formatDate(order.estimatedDeliveryTime)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Restaurant */}
        <Card
          className={`transition-colors ${
            isDark ? "bg-black/50 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`transition-colors ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.restaurant.phone && (
              <Button
                variant="outline"
                className={`w-full justify-start transition-colors ${
                  isDark
                    ? "border-white/10 hover:bg-white/10"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                asChild
              >
                <a href={`tel:${order.restaurant.phone}`}>
                  Call Restaurant: {order.restaurant.phone}
                </a>
              </Button>
            )}
            {order.restaurant.email && (
              <Button
                variant="outline"
                className={`w-full justify-start transition-colors ${
                  isDark
                    ? "border-white/10 hover:bg-white/10"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                asChild
              >
                <a href={`mailto:${order.restaurant.email}`}>
                  Email: {order.restaurant.email}
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className={`w-full justify-start transition-colors ${
                isDark
                  ? "border-white/10 hover:bg-white/10"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              asChild
            >
              <Link href={`/order/${order.restaurant.slug}`}>
                Order Again
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

