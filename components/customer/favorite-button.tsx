"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  menuItemId: string
  restaurantId: string
  className?: string
}

export function FavoriteButton({
  menuItemId,
  restaurantId,
  className,
}: FavoriteButtonProps) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) {
      setIsFavorite(false)
      return
    }

    // Check if item is favorited
    fetch(`/api/customers/favorites?restaurantId=${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        const favorited = data.favorites?.some(
          (f: any) => f.menuItemId === menuItemId
        )
        setIsFavorite(favorited)
      })
      .catch(() => {
        setIsFavorite(false)
      })
  }, [session, menuItemId, restaurantId])

  const handleToggle = async () => {
    if (!session?.user?.id) {
      // Show login modal or redirect
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        // Remove favorite
        const favorite = await fetch(`/api/customers/favorites?restaurantId=${restaurantId}`)
          .then((res) => res.json())
          .then((data) => data.favorites?.find((f: any) => f.menuItemId === menuItemId))

        if (favorite) {
          await fetch(`/api/customers/favorites/${favorite.id}`, {
            method: "DELETE",
          })
          setIsFavorite(false)
        }
      } else {
        // Add favorite
        await fetch("/api/customers/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            menuItemId,
            restaurantId,
          }),
        })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error("Toggle favorite error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session?.user?.id) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(className)}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        )}
      />
    </Button>
  )
}

