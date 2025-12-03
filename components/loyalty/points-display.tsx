"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Coins, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PointsDisplay() {
  const { data: session } = useSession()
  const [points, setPoints] = useState(0)
  const [tier, setTier] = useState("BRONZE")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    fetch("/api/loyalty/points")
      .then((res) => res.json())
      .then((data) => {
        setPoints(data.points || 0)
        setTier(data.tier || "BRONZE")
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session])

  if (!session?.user?.id || loading) {
    return null
  }

  const tierColors: Record<string, string> = {
    BRONZE: "bg-amber-600",
    SILVER: "bg-gray-400",
    GOLD: "bg-yellow-500",
    PLATINUM: "bg-purple-600",
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Loyalty Points</div>
              <div className="text-2xl font-bold">{points.toLocaleString()}</div>
            </div>
          </div>
          <Badge className={tierColors[tier] || "bg-gray-500"}>
            {tier}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

