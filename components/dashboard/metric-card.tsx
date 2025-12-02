"use client"

import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} as const

type IconName = keyof typeof iconMap

interface MetricCardProps {
  name: string
  value: string
  icon: IconName
  accentColor: string
  change?: number | null
  changeType?: "positive" | "negative" | "neutral"
  description?: string
}

export function MetricCard({
  name,
  value,
  icon,
  accentColor,
  change,
  changeType = "neutral",
  description,
}: MetricCardProps) {
  const Icon = iconMap[icon]
  return (
    <div
      className="relative overflow-hidden rounded-[18px] bg-[#1A1A1A] border border-[#2A2A2A] p-6 shadow-glow hover:shadow-glow-lg transition-all duration-200"
      style={{
        boxShadow: `0 4px 14px 0 rgba(0, 0, 0, 0.3), 0 0 20px ${accentColor}15`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-2">{name}</p>
          <p className="text-[32px] font-bold text-white leading-tight mb-3">{value}</p>
          <div className="flex items-center gap-2 text-xs">
            {change !== null && change !== undefined && (
              <>
                {changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 text-[#11C97A]" />
                ) : changeType === "negative" ? (
                  <ArrowDownRight className="h-3 w-3 text-[#FF6A55]" />
                ) : null}
                <span
                  className={cn(
                    "font-medium",
                    changeType === "positive" && "text-[#11C97A]",
                    changeType === "negative" && "text-[#FF6A55]",
                    changeType === "neutral" && "text-gray-400"
                  )}
                >
                  {changeType !== "neutral" && `${Math.abs(change).toFixed(1)}%`}
                </span>
                {changeType !== "neutral" && (
                  <span className="text-gray-500">vs yesterday</span>
                )}
              </>
            )}
            {description && change === null && (
              <span className="text-gray-500">{description}</span>
            )}
          </div>
        </div>
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <Icon className="h-6 w-6 text-white" style={{ color: accentColor }} />
        </div>
      </div>
    </div>
  )
}

