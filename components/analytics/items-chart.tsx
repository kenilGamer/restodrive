"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface ItemsChartProps {
  data: Array<{
    name: string
    quantitySold: number
    revenue: number
  }>
}

export function ItemsChart({ data }: ItemsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
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
            return [value, "Quantity Sold"]
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="revenue" fill="#DC2626" name="Revenue" />
        <Bar yAxisId="right" dataKey="quantitySold" fill="#3B82F6" name="Quantity Sold" />
      </BarChart>
    </ResponsiveContainer>
  )
}

