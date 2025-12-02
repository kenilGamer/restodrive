"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ShoppingCart, X } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Restaurant, MenuWithCategories } from "@/types"

interface QRMenuViewProps {
  restaurant: Restaurant
  menu: MenuWithCategories
}

export function QRMenuView({ restaurant, menu }: QRMenuViewProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    menu.categories[0]?.id || null
  )
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

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
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              {restaurant.logo && (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="h-8 w-8 rounded-md mr-3"
                />
              )}
              <h1 className="text-xl font-bold">{restaurant.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              {cart.length > 0 && (
                <Button
                  variant="default"
                  onClick={() => setShowCart(true)}
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart ({cart.length})
                  <span className="ml-2 font-semibold">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {menu.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                <h2 className="text-2xl font-bold mb-6">
                  {currentCategory.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentCategory.items.map((item) => (
                    <Card
                      key={item.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.image && item.image.length > 0 && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <p className="text-lg font-bold text-primary ml-4">
                            ₹{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.isVegetarian && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              Veg
                            </span>
                          )}
                          {item.isVegan && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              Vegan
                            </span>
                          )}
                          {item.dietaryTags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          className="w-full mt-4"
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCart(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ₹{Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateCartQuantity(index, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateCartQuantity(index, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(index)}
                          className="ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              {selectedItem.image && selectedItem.image.length > 0 && (
                <img
                  src={selectedItem.image[0]}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedItem.description}
              </p>
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-primary">
                  ₹{Number(selectedItem.price).toFixed(2)}
                </span>
                <Button onClick={() => addToCart(selectedItem)}>
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

