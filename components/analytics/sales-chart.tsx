"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface SalesChartProps {
  data: Array<{
    date: string
    revenue: number
    orders: number
  }>
  groupBy: "day" | "week" | "month"
}

export function SalesChart({ data, groupBy }: SalesChartProps) {
  const formatDate = (date: string) => {
    const d = new Date(date)
    switch (groupBy) {
      case "month":
        return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" })
      case "week":
        return `Week of ${d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`
      default:
        return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    }
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          style={{ fontSize: "12px" }}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "revenue") {
              return [formatCurrency(value), "Revenue"]
            }
            return [value, "Orders"]
          }}
          labelFormatter={(label) => formatDate(label)}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          stroke="#DC2626"
          strokeWidth={2}
          name="Revenue"
          dot={{ r: 4 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="orders"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Orders"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

