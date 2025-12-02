"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X, Plus, Minus, Sparkles } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Restaurant, MenuWithCategories } from "@/types"
import Image from "next/image"
import { CheckoutModal } from "@/components/checkout/checkout-modal"

interface QRMenuViewProps {
  restaurant: Restaurant
  menu: MenuWithCategories
}

export function QRMenuView({ restaurant, menu }: QRMenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    menu.categories[0]?.id || null
  )
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const addToCart = (item: any) => {
    setCart([...cart, { ...item, quantity: 1 }])
    setShowCart(true)
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index)
      return
    }
    const newCart = [...cart]
    newCart[index].quantity = quantity
    setCart(newCart)
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )

  const currentCategory = menu.categories.find(
    (c) => c.id === selectedCategory
  )

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>

      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              {restaurant.logo ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-cyan-500/30">
                  <Image
                    src={restaurant.logo}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-500/30">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-orbitron font-bold text-white">
                  {restaurant.name}
                </h1>
                {restaurant.description && (
                  <p className="text-sm text-gray-400">{restaurant.description}</p>
                )}
              </div>
            </div>
            {cart.length > 0 && (
              <Button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({cart.length})
                <span className="ml-2 font-semibold">
                  {formatCurrency(cartTotal, restaurant.currency || "INR")}
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <h2 className="text-lg font-orbitron font-bold mb-6 text-cyan-400">
                Categories
              </h2>
              <div className="space-y-2">
                {menu.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 text-gray-300"
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
                <h2 className="text-3xl font-orbitron font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {currentCategory.name}
                </h2>
                {currentCategory.items.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-400 text-lg">No items in this category yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentCategory.items.map((item) => (
                      <Card
                        key={item.id}
                        className="bg-black/50 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] cursor-pointer group overflow-hidden"
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
                              <h3 className="font-orbitron font-bold text-xl text-white mb-2">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <p className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ml-4">
                              {formatCurrency(Number(item.price), restaurant.currency || "INR")}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.isVegetarian && (
                              <span className="px-3 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                                Veg
                              </span>
                            )}
                            {item.isVegan && (
                              <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                                Vegan
                              </span>
                            )}
                            {item.dietaryTags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full capitalize"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Button
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(item)
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-orbitron font-bold text-white">Your Cart</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-sm text-gray-400">
                            {formatCurrency(Number(item.price), restaurant.currency || "INR")} each
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCartQuantity(index, item.quantity - 1)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-white font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCartQuantity(index, item.quantity + 1)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(index)}
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex justify-between mb-6">
                      <span className="text-xl font-orbitron font-bold text-white">Total:</span>
                      <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {formatCurrency(cartTotal, restaurant.currency || "INR")}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        setShowCart(false)
                        setShowCheckout(true)
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.5)] py-6 text-lg font-semibold"
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-black/95 backdrop-blur-xl border border-white/10"
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
              <h2 className="text-3xl font-orbitron font-bold text-white mb-3">
                {selectedItem.name}
              </h2>
              {selectedItem.description && (
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {selectedItem.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedItem.isVegetarian && (
                  <span className="px-3 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                    Vegetarian
                  </span>
                )}
                {selectedItem.isVegan && (
                  <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                    Vegan
                  </span>
                )}
                {selectedItem.dietaryTags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {formatCurrency(Number(selectedItem.price), restaurant.currency || "INR")}
                </span>
                <Button
                  onClick={() => {
                    addToCart(selectedItem)
                    setSelectedItem(null)
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
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
        cart={cart}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        currency={restaurant.currency || "INR"}
        onOrderComplete={(orderId) => {
          setCart([])
          setShowCart(false)
          alert(`Order #${orderId} placed successfully!`)
        }}
      />
    </div>
  )
}
