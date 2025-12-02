"use client"

import { formatCurrency } from "@/lib/utils"

interface PeakHoursHeatmapProps {
  data: Array<{
    hour: number
    orderCount: number
    revenue: number
  }>
}

export function PeakHoursHeatmap({ data }: PeakHoursHeatmapProps) {
  const maxOrders = Math.max(...data.map((d) => d.orderCount), 1)

  const getIntensity = (orderCount: number) => {
    const percentage = (orderCount / maxOrders) * 100
    if (percentage === 0) return "bg-gray-100"
    if (percentage < 25) return "bg-blue-200"
    if (percentage < 50) return "bg-blue-400"
    if (percentage < 75) return "bg-blue-600"
    return "bg-blue-800"
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:00 ${period}`
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2">
        {data.map((item) => (
          <div
            key={item.hour}
            className={`${getIntensity(item.orderCount)} rounded p-3 text-center transition-all hover:scale-105`}
            title={`${formatHour(item.hour)}: ${item.orderCount} orders, ${formatCurrency(item.revenue)}`}
          >
            <div className="text-xs font-medium text-white">
              {formatHour(item.hour)}
            </div>
            <div className="mt-1 text-sm font-bold text-white">
              {item.orderCount}
            </div>
            <div className="text-xs text-white/80">
              {formatCurrency(item.revenue)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Less busy</span>
        <span>Peak hours</span>
      </div>
    </div>
  )
}

