"use client"

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface BarChartProps {
  data: Array<{
    day: string
    value: number
    isHighlighted?: boolean
  }>
}

export function BarChart({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
        <XAxis
          dataKey="day"
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          axisLine={{ stroke: "#2A2A2A" }}
        />
        <YAxis
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          axisLine={{ stroke: "#2A2A2A" }}
          domain={[0, 300]}
          ticks={[50, 100, 150, 200, 250, 300]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "8px",
            color: "#FFFFFF",
          }}
          formatter={(value: number) => [value, "Orders"]}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isHighlighted ? "#FCD34D" : "#2A2A2A"}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
