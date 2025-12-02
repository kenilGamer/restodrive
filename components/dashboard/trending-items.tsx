"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface TrendingItem {
  menuItemId: string
  name: string
  image: string[]
  price: number
  revenue: number
  quantitySold: number
}

interface TrendingItemsProps {
  restaurantId: string
  limit?: number
}

export function TrendingItems({ restaurantId, limit = 10 }: TrendingItemsProps) {
  const [items, setItems] = useState<TrendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        const today = new Date()
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const params = new URLSearchParams({
          restaurantId,
          startDate: thirtyDaysAgo.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
          limit: limit.toString(),
        })

        const res = await fetch(`/api/analytics/items?${params}`)
        if (res.ok) {
          const data = await res.json()
          // Fetch menu item details including images
          const itemsWithImages = await Promise.all(
            data.topItems.map(async (item: any) => {
              try {
                const itemRes = await fetch(`/api/menus/items/${item.menuItemId}`)
                if (itemRes.ok) {
                  const itemData = await itemRes.json()
                  return {
                    ...item,
                    image: itemData.menuItem?.image || [],
                    price: Number(itemData.menuItem?.price || item.revenue / item.quantitySold),
                  }
                }
                return { ...item, image: [], price: item.revenue / item.quantitySold }
              } catch {
                return { ...item, image: [], price: item.revenue / item.quantitySold }
              }
            })
          )
          setItems(itemsWithImages)
        }
      } catch (error) {
        console.error("Error fetching trending items:", error)
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId) {
      fetchTrendingItems()
    }
  }, [restaurantId, limit])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 h-48 bg-[#2A2A2A] rounded-[18px] animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardContent className="p-6">
          <p className="text-gray-400 text-sm">No trending items available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
      <CardContent className="p-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Trending Orders</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("left")}
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("right")}
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex-shrink-0 w-64 bg-[#0D0D0D] rounded-[18px] overflow-hidden border border-[#2A2A2A] shadow-glow hover:shadow-glow-lg transition-all duration-200"
              >
                <div className="relative h-40 bg-[#2A2A2A]">
                  {item.image && item.image.length > 0 ? (
                    <Image
                      src={item.image[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="text-white font-semibold mb-1 truncate">{item.name}</h4>
                  <p className="text-[#11C97A] font-bold text-lg">
                    Price: {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

