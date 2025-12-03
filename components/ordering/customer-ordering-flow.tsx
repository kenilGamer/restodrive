"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X, Plus, Minus, Sun, Moon, Search } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Restaurant, MenuWithCategories } from "@/types"
import Image from "next/image"
import { CheckoutModal } from "@/components/checkout/checkout-modal"
import { useCartStore } from "@/store/cart-store"
import { useRouter } from "next/navigation"

interface CustomerOrderingFlowProps {
  restaurant: Restaurant
  menu: MenuWithCategories
}

export function CustomerOrderingFlow({
  restaurant,
  menu,
}: CustomerOrderingFlowProps) {
  const router = useRouter()
  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setRestaurant,
    getTotal,
    getItemCount,
  } = useCartStore()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    menu.categories[0]?.id || null
  )
  const [showCart, setShowCart] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  // Set restaurant in cart store
  useEffect(() => {
    setRestaurant(restaurant.id)
  }, [restaurant.id, setRestaurant])

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      quantity: 1,
      image: item.image,
      variantId: item.variantId,
      modifiers: item.modifiers || [],
    })
    setShowCart(true)
  }

  const cartTotal = getTotal()
  const cartCount = getItemCount()
  const isDark = theme === "dark"

  // Filter items by search query
  const currentCategory = menu.categories.find((c) => c.id === selectedCategory)
  const filteredItems = currentCategory?.items.filter((item) =>
    searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || []

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              {restaurant.logo ? (
                <div
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border transition-colors ${
                    isDark ? "border-cyan-500/30" : "border-cyan-400/40"
                  }`}
                >
                  <Image
                    src={restaurant.logo}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 border transition-colors ${
                    isDark ? "border-cyan-500/30" : "border-cyan-400/40"
                  }`}
                >
                  <span className="text-white text-xl">🍽️</span>
                </div>
              )}
              <div>
                <h1
                  className={`text-xl font-bold transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {restaurant.name}
                </h1>
                {restaurant.description && (
                  <p
                    className={`text-sm transition-colors ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {restaurant.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
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
              {/* Cart Button */}
              {cartCount > 0 && (
                <Button
                  onClick={() => setShowCart(true)}
                  className={`relative border-0 transition-all ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                      : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart ({cartCount})
                  <span className="ml-2 font-semibold">
                    {formatCurrency(cartTotal, restaurant.currency || "INR")}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl transition-colors ${
                isDark
                  ? "bg-[#1A1A1A] border border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500"
                  : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-cyan-400"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <h2
                className={`text-lg font-bold mb-6 transition-colors ${
                  isDark ? "text-cyan-400" : "text-cyan-600"
                }`}
              >
                Categories
              </h2>
              <div className="space-y-2">
                {menu.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setSearchQuery("")
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? isDark
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-400/50 text-cyan-700 shadow-md"
                        : isDark
                          ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 text-gray-300"
                          : "bg-white border border-gray-200 hover:bg-gray-50 hover:border-cyan-400/50 text-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3">
            {currentCategory && (
              <>
                <h2
                  className={`text-3xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent transition-colors ${
                    isDark ? "from-cyan-400 to-blue-400" : "from-cyan-600 to-blue-600"
                  }`}
                >
                  {currentCategory.name}
                </h2>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-16">
                    <p
                      className={`text-lg transition-colors ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {searchQuery
                        ? "No items found matching your search"
                        : "No items in this category yet"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                      <Card
                        key={item.id}
                        className={`backdrop-blur-sm transition-all duration-300 cursor-pointer group overflow-hidden ${
                          isDark
                            ? "bg-black/50 border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                            : "bg-white border border-gray-200 hover:border-cyan-400/50 hover:shadow-lg"
                        }`}
                        onClick={() => setSelectedItem(item)}
                      >
                        {item.image && item.image.length > 0 && (
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                              src={item.image[0]}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent"></div>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3
                                className={`font-bold text-xl mb-2 transition-colors ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {item.name}
                              </h3>
                              {item.description && (
                                <p
                                  className={`text-sm line-clamp-2 transition-colors ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <p
                              className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ml-4 transition-colors ${
                                isDark
                                  ? "from-cyan-400 to-blue-400"
                                  : "from-cyan-600 to-blue-600"
                              }`}
                            >
                              {formatCurrency(
                                Number(item.price),
                                restaurant.currency || "INR"
                              )}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.isVegetarian && (
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                  isDark
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                Veg
                              </span>
                            )}
                            {item.isVegan && (
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                  isDark
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-green-100 text-green-700 border border-green-200"
                                }`}
                              >
                                Vegan
                              </span>
                            )}
                            {item.dietaryTags.map((tag) => (
                              <span
                                key={tag}
                                className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors ${
                                  isDark
                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                    : "bg-purple-100 text-purple-700 border border-purple-200"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Button
                            className={`w-full text-white border-0 transition-all ${
                              isDark
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-md"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(item)
                            }}
                          >
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div
            className={`fixed inset-0 backdrop-blur-sm z-50 transition-colors ${
              isDark ? "bg-black/80" : "bg-gray-900/60"
            }`}
            onClick={() => setShowCart(false)}
          />
          <div
            className={`fixed inset-y-0 right-0 w-full md:w-96 backdrop-blur-xl border-l z-50 overflow-y-auto transition-colors ${
              isDark
                ? "bg-black/95 border-white/10"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl font-bold transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Your Cart
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCart(false)}
                  className={`transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart
                    className={`h-16 w-16 mx-auto mb-4 transition-colors ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`transition-colors ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                          isDark
                            ? "bg-white/5 border border-white/10"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex-1">
                          <p
                            className={`font-semibold transition-colors ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p
                            className={`text-sm transition-colors ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {formatCurrency(
                              item.price,
                              restaurant.currency || "INR"
                            )}{" "}
                            each
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className={`h-8 w-8 border transition-colors ${
                              isDark
                                ? "text-gray-400 hover:text-white hover:bg-white/10 border-white/10"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-200"
                            }`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span
                            className={`w-8 text-center font-semibold transition-colors ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className={`h-8 w-8 border transition-colors ${
                              isDark
                                ? "text-gray-400 hover:text-white hover:bg-white/10 border-white/10"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-200"
                            }`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className={`h-8 w-8 ml-2 transition-colors ${
                              isDark
                                ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                : "text-red-600 hover:text-red-700 hover:bg-red-50"
                            }`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`border-t pt-6 transition-colors ${
                      isDark ? "border-white/10" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between mb-6">
                      <span
                        className={`text-xl font-bold transition-colors ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Total:
                      </span>
                      <span
                        className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors ${
                          isDark
                            ? "from-cyan-400 to-blue-400"
                            : "from-cyan-600 to-blue-600"
                        }`}
                      >
                        {formatCurrency(cartTotal, restaurant.currency || "INR")}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        setShowCart(false)
                        setShowCheckout(true)
                      }}
                      className={`w-full text-white border-0 py-6 text-lg font-semibold transition-all ${
                        isDark
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                          : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-lg"
                      }`}
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors ${
            isDark ? "bg-black/80" : "bg-gray-900/60"
          }`}
          onClick={() => setSelectedItem(null)}
        >
          <Card
            className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl transition-colors ${
              isDark
                ? "bg-black/95 border border-white/10"
                : "bg-white border border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              {selectedItem.image && selectedItem.image.length > 0 && (
                <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={selectedItem.image[0]}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <h2
                className={`text-3xl font-bold mb-3 transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {selectedItem.name}
              </h2>
              {selectedItem.description && (
                <p
                  className={`mb-6 leading-relaxed transition-colors ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedItem.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedItem.isVegetarian && (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      isDark
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    Vegetarian
                  </span>
                )}
                {selectedItem.isVegan && (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      isDark
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    Vegan
                  </span>
                )}
                {selectedItem.dietaryTags.map((tag: string) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors ${
                      isDark
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "bg-purple-100 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors ${
                    isDark
                      ? "from-cyan-400 to-blue-400"
                      : "from-cyan-600 to-blue-600"
                  }`}
                >
                  {formatCurrency(
                    Number(selectedItem.price),
                    restaurant.currency || "INR"
                  )}
                </span>
                <Button
                  onClick={() => {
                    handleAddToCart(selectedItem)
                    setSelectedItem(null)
                  }}
                  className={`text-white border-0 transition-all ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                      : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-lg"
                  }`}
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cartItems}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        currency={restaurant.currency || "INR"}
        onOrderComplete={(orderId) => {
          clearCart()
          setShowCart(false)
          setShowCheckout(false)
          // Redirect to order tracking page
          router.push(`/order/track/${orderId}`)
        }}
      />
    </div>
  )
}

