"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface PaymentMethodsChartProps {
  data: Array<{
    method: string
    amount: number
    count: number
  }>
}

const COLORS = ["#DC2626", "#F97316", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"]

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="amount"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

