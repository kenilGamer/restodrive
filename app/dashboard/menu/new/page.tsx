"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewMenuPage() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    restaurantId: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/menus")
      .then((res) => res.json())
      .then((data) => {
        if (data.restaurants) {
          setRestaurants(data.restaurants)
          if (data.restaurants.length === 1) {
            setFormData((prev) => ({
              ...prev,
              restaurantId: data.restaurants[0].id,
            }))
          }
        }
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create menu")
        return
      }

      router.push(`/dashboard/menu/${data.menu.id}`)
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/menu"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menus
        </Link>
        <h1 className="text-3xl font-bold text-white">Create New Menu</h1>
        <p className="mt-2 text-sm text-white">
          Create a new menu for your restaurant
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Details</CardTitle>
          <CardDescription>
            Enter the basic information for your new menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {restaurants.length > 1 && (
              <div className="space-y-2">
                <label htmlFor="restaurantId" className="text-sm font-medium">
                  Restaurant
                </label>
                <select
                  id="restaurantId"
                  value={formData.restaurantId}
                  onChange={(e) =>
                    setFormData({ ...formData, restaurantId: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Menu Name *
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Menu, Lunch Menu, Summer Specials"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Optional description for this menu"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Menu"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/menu">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

