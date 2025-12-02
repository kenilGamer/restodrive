"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface DonutChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  centerValue?: string
}

const COLORS = ["#FF6A55", "#C97AFF", "#11C97A", "#6B7CFF"]

export function DonutChart({ data, centerValue = "100%" }: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
          />
          <Legend
            wrapperStyle={{ color: "#FFFFFF" }}
            iconType="circle"
            formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{centerValue}</div>
        </div>
      </div>
    </div>
  )
}

