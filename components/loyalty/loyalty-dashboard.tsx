"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Coins, Gift, TrendingUp, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface LoyaltyData {
  points: number
  tier: string
  tierBenefits: {
    name: string
    discount: number
    pointsMultiplier: number
    description: string
  }
  nextTier: string | null
  pointsToNextTier: number
  progressPercentage: number
}

export function LoyaltyDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<LoyaltyData | null>(null)
  const [referralCode, setReferralCode] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    Promise.all([
      fetch("/api/loyalty/tier").then((res) => res.json()),
      fetch("/api/loyalty/referral").then((res) => res.json()),
    ])
      .then(([tierData, referralData]) => {
        // Validate and set data with defaults
        if (tierData && typeof tierData === 'object' && !tierData.error) {
          setData({
            points: tierData.currentPoints ?? tierData.loyaltyPoints ?? tierData.points ?? 0,
            tier: tierData.currentTier ?? tierData.tier ?? "BRONZE",
            tierBenefits: tierData.tierBenefits ?? {
              name: tierData.currentTier ?? "BRONZE",
              discount: 0,
              pointsMultiplier: 1,
              description: "Start earning points to unlock benefits",
            },
            nextTier: tierData.nextTier ?? null,
            pointsToNextTier: tierData.pointsToNextTier ?? 0,
            progressPercentage: tierData.progressPercentage ?? 0,
          })
        }
        setReferralCode(referralData?.referralCode ?? "")
      })
      .catch((error) => {
        console.error("Error fetching loyalty data:", error)
      })
      .finally(() => setLoading(false))
  }, [session])

  const handleShareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join me and earn rewards!",
        text: `Use my referral code ${referralCode} to get bonus points!`,
        url: `${window.location.origin}/customer/register?ref=${referralCode}`,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/customer/register?ref=${referralCode}`
      )
      alert("Referral link copied to clipboard!")
    }
  }

  if (!session?.user?.id || loading || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading loyalty information...</div>
        </CardContent>
      </Card>
    )
  }

  // Ensure data has required fields with defaults
  const safeData = {
    points: data.points ?? 0,
    tier: data.tier ?? "BRONZE",
    tierBenefits: data.tierBenefits ?? {
      name: "BRONZE",
      discount: 0,
      pointsMultiplier: 1,
      description: "Start earning points to unlock benefits",
    },
    nextTier: data.nextTier ?? null,
    pointsToNextTier: data.pointsToNextTier ?? 0,
    progressPercentage: data.progressPercentage ?? 0,
  }

  const tierColors: Record<string, string> = {
    BRONZE: "bg-amber-600",
    SILVER: "bg-gray-400",
    GOLD: "bg-yellow-500",
    PLATINUM: "bg-purple-600",
  }

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Your Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">
            {safeData.points.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Badge className={tierColors[safeData.tier] || "bg-gray-500"}>
              {safeData.tier}
            </Badge>
            <span className="text-sm text-gray-500">
              {safeData.tierBenefits.description}
            </span>
          </div>

          {safeData.nextTier && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {safeData.nextTier}</span>
                <span>{safeData.pointsToNextTier} points needed</span>
              </div>
              <Progress value={safeData.progressPercentage} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Your Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {safeData.tierBenefits.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <Badge variant="secondary">{safeData.tierBenefits.discount}%</Badge>
              </div>
            )}
            <div className="flex justify-between">
              <span>Points Multiplier</span>
              <Badge variant="secondary">{safeData.tierBenefits.pointsMultiplier}x</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral */}
      {referralCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Refer Friends
            </CardTitle>
            <CardDescription>
              Share your referral code and earn bonus points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Your Referral Code</div>
                <div className="text-2xl font-mono font-bold">{referralCode}</div>
              </div>
              <Button onClick={handleShareReferral} className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share Referral Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

