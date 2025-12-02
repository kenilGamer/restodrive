"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Heart, Star, MapPin, Clock, Filter } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function CustomerHomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)

  const categories = ["All", "Pizza", "Burgers", "Salads", "Desserts", "Drinks"]
  const featuredItems = [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Fresh mozzarella, tomato sauce, basil",
      price: 12.99,
      image: [],
      rating: 4.8,
      category: "Pizza",
    },
    {
      id: "2",
      name: "Classic Burger",
      description: "Beef patty, lettuce, tomato, special sauce",
      price: 9.99,
      image: [],
      rating: 4.6,
      category: "Burgers",
    },
    {
      id: "3",
      name: "Caesar Salad",
      description: "Crisp romaine, parmesan, croutons",
      price: 8.99,
      image: [],
      rating: 4.7,
      category: "Salads",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Foodie Kitchen</h1>
              <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                <MapPin className="h-3 w-3" />
                <span>123 Main St, City</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#FF6A55] text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for dishes..."
            className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[18px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C97AFF] transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === "All" ? null : category)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category || (category === "All" && !selectedCategory)
                  ? "bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] text-white shadow-glow"
                  : "bg-[#1A1A1A] text-gray-400 border border-[#2A2A2A] hover:border-[#2A2A2A]/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Items */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Featured Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/customer/menu/${item.id}`}>
                  <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow hover:shadow-glow-lg transition-all duration-200 overflow-hidden group cursor-pointer">
                    <div className="relative h-48 bg-[#0D0D0D]">
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
                          <span className="text-6xl">🍕</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-[#1A1A1A]/80 backdrop-blur-sm hover:bg-[#1A1A1A]"
                        >
                          <Heart className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[#FCD34D] fill-[#FCD34D]" />
                          <span className="text-sm font-medium text-white">{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#11C97A]">
                            {formatCurrency(item.price)}
                          </span>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

