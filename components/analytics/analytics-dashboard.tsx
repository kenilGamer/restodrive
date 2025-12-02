"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SalesChart } from "./sales-chart"
import { ItemsChart } from "./items-chart"
import { PeakHoursHeatmap } from "./peak-hours-heatmap"
import { PaymentMethodsChart } from "./payment-methods-chart"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, ShoppingCart, Users, TrendingUp, Download, RefreshCw } from "lucide-react"

interface AnalyticsDashboardProps {
  restaurantId: string
  defaultStartDate: string
  defaultEndDate: string
  defaultGroupBy: "day" | "week" | "month"
}

interface SalesData {
  period: { start: string; end: string }
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  dailyBreakdown: Array<{ date: string; revenue: number; orders: number }>
  trend: string
  comparison: {
    previousRevenue: number
    previousOrders: number
  }
}

interface ItemsData {
  topItems: Array<{
    menuItemId: string
    name: string
    category: string
    quantitySold: number
    revenue: number
    percentageOfTotal: number
  }>
  totalRevenue: number
}

interface PeakHoursData {
  peakHours: Array<{ hour: number; orderCount: number; revenue: number }>
  peakDays: Array<{ day: string; orderCount: number; revenue: number }>
  peakHour: number
  peakDay: string
  averageOrdersPerHour: number
}

interface CustomersData {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  averageOrderValue: number
  averageCustomerValue: number
  topCustomers: Array<{
    phone: string | null
    email: string | null
    name: string | null
    orderCount: number
    totalSpent: number
  }>
}

export function AnalyticsDashboard({
  restaurantId,
  defaultStartDate,
  defaultEndDate,
  defaultGroupBy,
}: AnalyticsDashboardProps) {
  const [startDate, setStartDate] = useState(defaultStartDate)
  const [endDate, setEndDate] = useState(defaultEndDate)
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">(defaultGroupBy)
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [itemsData, setItemsData] = useState<ItemsData | null>(null)
  const [peakHoursData, setPeakHoursData] = useState<PeakHoursData | null>(null)
  const [customersData, setCustomersData] = useState<CustomersData | null>(null)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        restaurantId,
        startDate,
        endDate,
        groupBy,
      })

      const [salesRes, itemsRes, peakHoursRes, customersRes] = await Promise.all([
        fetch(`/api/analytics/sales?${params}`),
        fetch(`/api/analytics/items?${params}`),
        fetch(`/api/analytics/peak-hours?${params}`),
        fetch(`/api/analytics/customers?${params}`),
      ])

      if (salesRes.ok) {
        const data = await salesRes.json()
        setSalesData(data)
      }
      if (itemsRes.ok) {
        const data = await itemsRes.json()
        setItemsData(data)
      }
      if (peakHoursRes.ok) {
        const data = await peakHoursRes.json()
        setPeakHoursData(data)
      }
      if (customersRes.ok) {
        const data = await customersRes.json()
        setCustomersData(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [startDate, endDate, groupBy, restaurantId])

  const handleDateRangeChange = (range: string) => {
    const today = new Date()
    const start = new Date()

    switch (range) {
      case "7d":
        start.setDate(today.getDate() - 7)
        break
      case "30d":
        start.setDate(today.getDate() - 30)
        break
      case "90d":
        start.setDate(today.getDate() - 90)
        break
      case "1y":
        start.setFullYear(today.getFullYear() - 1)
        break
      default:
        start.setDate(today.getDate() - 30)
    }

    setStartDate(start.toISOString().split("T")[0])
    setEndDate(today.toISOString().split("T")[0])
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:00 ${period}`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDateRangeChange("7d")}
          >
            Last 7 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDateRangeChange("30d")}
          >
            Last 30 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDateRangeChange("90d")}
          >
            Last 90 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDateRangeChange("1y")}
          >
            Last year
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={groupBy} onValueChange={(value) => setGroupBy(value as "day" | "week" | "month")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : salesData ? formatCurrency(salesData.totalRevenue) : "₹0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {salesData && (
                <span className={parseFloat(salesData.trend) >= 0 ? "text-green-600" : "text-red-600"}>
                  {parseFloat(salesData.trend) >= 0 ? "+" : ""}
                  {salesData.trend}%
                </span>
              )}{" "}
              from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : salesData ? salesData.totalOrders.toLocaleString() : "0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {salesData && salesData.comparison.previousOrders > 0 && (
                <>
                  {salesData.totalOrders >= salesData.comparison.previousOrders ? "+" : ""}
                  {salesData.totalOrders - salesData.comparison.previousOrders} from previous period
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : salesData ? formatCurrency(salesData.averageOrderValue) : "₹0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per order average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : customersData ? customersData.totalCustomers.toLocaleString() : "0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {customersData && (
                <>
                  {customersData.newCustomers} new, {customersData.returningCustomers} returning
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Revenue and orders over time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : salesData ? (
              <SalesChart data={salesData.dailyBreakdown} groupBy={groupBy} />
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">No data available</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Items</CardTitle>
            <CardDescription>Best selling menu items</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : itemsData && itemsData.topItems.length > 0 ? (
              <ItemsChart
                data={itemsData.topItems.slice(0, 10).map((item) => ({
                  name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
                  quantitySold: item.quantitySold,
                  revenue: item.revenue,
                }))}
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">No data available</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours and Payment Methods */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>
              {peakHoursData && `Busiest: ${formatHour(peakHoursData.peakHour)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : peakHoursData ? (
              <PeakHoursHeatmap data={peakHoursData.peakHours} />
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">No data available</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">Payment method data coming soon</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Ranked by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : itemsData && itemsData.topItems.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {itemsData.topItems.slice(0, 10).map((item, index) => (
                    <div key={item.menuItemId} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.revenue)}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantitySold} sold ({item.percentageOfTotal.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Most valuable customers</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : customersData && customersData.topCustomers.length > 0 ? (
              <div className="space-y-2">
                {customersData.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium">
                        {customer.name || customer.email || customer.phone || "Anonymous"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.orderCount} orders
                      </div>
                    </div>
                    <div className="text-right font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

