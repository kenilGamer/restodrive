"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface RestaurantSettingsFormProps {
  restaurant: {
    id: string
    name: string
    description?: string | null
    phone?: string | null
    email?: string | null
    website?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zipCode?: string | null
    cuisineType: string[]
    priceRange: string
    currency?: string | null
    taxRate?: number | null
    serviceCharge?: number | null
    allowCOD: boolean
    minOrderValue?: number | null
  }
}

export function RestaurantSettingsForm({ restaurant }: RestaurantSettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: restaurant.name || "",
    description: restaurant.description || "",
    phone: restaurant.phone || "",
    email: restaurant.email || "",
    website: restaurant.website || "",
    address: restaurant.address || "",
    city: restaurant.city || "",
    state: restaurant.state || "",
    country: restaurant.country || "India",
    zipCode: restaurant.zipCode || "",
    cuisineType: restaurant.cuisineType.join(", ") || "",
    priceRange: restaurant.priceRange || "MEDIUM",
    currency: restaurant.currency || "INR",
    taxRate: restaurant.taxRate ? (restaurant.taxRate * 100).toString() : "18",
    serviceCharge: restaurant.serviceCharge ? (restaurant.serviceCharge * 100).toString() : "10",
    allowCOD: restaurant.allowCOD,
    minOrderValue: restaurant.minOrderValue?.toString() || "0",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cuisineTypeArray = formData.cuisineType
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)

      const response = await fetch(`/api/restaurants/${restaurant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          phone: formData.phone || null,
          email: formData.email || null,
          website: formData.website || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          country: formData.country || null,
          zipCode: formData.zipCode || null,
          cuisineType: cuisineTypeArray,
          priceRange: formData.priceRange,
          currency: formData.currency,
          taxRate: parseFloat(formData.taxRate) / 100,
          serviceCharge: parseFloat(formData.serviceCharge) / 100,
          allowCOD: formData.allowCOD,
          minOrderValue: parseFloat(formData.minOrderValue) || 0,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
        alert("Restaurant settings updated successfully!")
      } else {
        alert(data.error || "Failed to update restaurant settings")
      }
    } catch (error) {
      console.error("Error updating restaurant:", error)
      alert("Failed to update restaurant settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-400">
          Restaurant Name *
        </Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-400">
          Description
        </Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C97AFF] transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-400">
            Phone
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-400">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="text-gray-400">
          Website
        </Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-gray-400">
          Address
        </Label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C97AFF] transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-gray-400">
            City
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-gray-400">
            State
          </Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-gray-400">
            ZIP Code
          </Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cuisineType" className="text-gray-400">
          Cuisine Types (comma-separated)
        </Label>
        <Input
          id="cuisineType"
          value={formData.cuisineType}
          onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
          className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          placeholder="Italian, Indian, Chinese"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceRange" className="text-gray-400">
            Price Range
          </Label>
          <select
            id="priceRange"
            value={formData.priceRange}
            onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
            className="w-full px-4 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white focus:outline-none focus:border-[#C97AFF]"
          >
            <option value="BUDGET">Budget</option>
            <option value="MEDIUM">Medium</option>
            <option value="PREMIUM">Premium</option>
            <option value="LUXURY">Luxury</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-gray-400">
            Currency
          </Label>
          <Input
            id="currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxRate" className="text-gray-400">
            Tax Rate (%)
          </Label>
          <Input
            id="taxRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.taxRate}
            onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceCharge" className="text-gray-400">
            Service Charge (%)
          </Label>
          <Input
            id="serviceCharge"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.serviceCharge}
            onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minOrderValue" className="text-gray-400">
            Minimum Order Value
          </Label>
          <Input
            id="minOrderValue"
            type="number"
            step="0.01"
            min="0"
            value={formData.minOrderValue}
            onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
            className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-400">Payment Options</Label>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="allowCOD"
              checked={formData.allowCOD}
              onChange={(e) => setFormData({ ...formData, allowCOD: e.target.checked })}
              className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#C97AFF] focus:ring-[#C97AFF]"
            />
            <Label htmlFor="allowCOD" className="text-gray-300 cursor-pointer">
              Allow Cash on Delivery (COD)
            </Label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0"
      >
        <Save className="h-4 w-4 mr-2" />
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

