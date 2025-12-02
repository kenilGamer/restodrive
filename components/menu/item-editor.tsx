"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface ItemEditorProps {
  categoryId: string
  itemId?: string
  onClose: () => void
  onSuccess: (item: any) => void
}

export function ItemEditor({
  categoryId,
  itemId,
  onClose,
  onSuccess,
}: ItemEditorProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: [] as string[],
    allergens: [] as string[],
    dietaryTags: [] as string[],
    spiceLevel: "MILD" as "MILD" | "MEDIUM" | "HOT" | "EXTRA_HOT",
    customTags: [] as string[],
    isVegetarian: false,
    isVegan: false,
    preparationTime: "",
    displayOrder: 0,
    isAvailable: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (itemId) {
      setIsEditing(true)
      fetch(`/api/menus/items/${itemId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.menuItem) {
            const item = data.menuItem
            setFormData({
              name: item.name,
              description: item.description || "",
              price: item.price.toString(),
              image: item.image || [],
              allergens: item.allergens || [],
              dietaryTags: item.dietaryTags || [],
              spiceLevel: item.spiceLevel || "MILD",
              customTags: item.customTags || [],
              isVegetarian: item.isVegetarian || false,
              isVegan: item.isVegan || false,
              preparationTime: item.preparationTime?.toString() || "",
              displayOrder: item.displayOrder || 0,
              isAvailable: item.isAvailable ?? true,
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching item:", error)
        })
    }
  }, [itemId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = isEditing
        ? `/api/menus/items/${itemId}`
        : `/api/menus/categories/${categoryId}/items`
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          preparationTime: formData.preparationTime
            ? parseInt(formData.preparationTime)
            : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || `Failed to ${isEditing ? "update" : "create"} item`)
        return
      }

      onSuccess(data.menuItem || data.item)
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const commonAllergens = [
    "gluten",
    "dairy",
    "eggs",
    "fish",
    "shellfish",
    "tree nuts",
    "peanuts",
    "soy",
  ]

  const commonDietaryTags = [
    "vegetarian",
    "vegan",
    "keto",
    "paleo",
    "halal",
    "kosher",
    "gluten-free",
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{isEditing ? "Edit Item" : "New Menu Item"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {isEditing ? "Update item details" : "Add a new item to this category"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Item Name *
            </label>
            <Input
              id="name"
              placeholder="e.g., Margherita Pizza"
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
              placeholder="Describe the item..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price (₹) *
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="250.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="preparationTime" className="text-sm font-medium">
                Prep Time (min)
              </label>
              <Input
                id="preparationTime"
                type="number"
                placeholder="15"
                value={formData.preparationTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparationTime: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="spiceLevel" className="text-sm font-medium">
              Spice Level
            </label>
            <select
              id="spiceLevel"
              value={formData.spiceLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  spiceLevel: e.target.value as any,
                })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="MILD">Mild</option>
              <option value="MEDIUM">Medium</option>
              <option value="HOT">Hot</option>
              <option value="EXTRA_HOT">Extra Hot</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dietary Options</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVegetarian}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isVegetarian: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVegan}
                  onChange={(e) =>
                    setFormData({ ...formData, isVegan: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Vegan</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Allergens</label>
            <div className="flex flex-wrap gap-2">
              {commonAllergens.map((allergen) => (
                <label
                  key={allergen}
                  className="flex items-center gap-2 px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.allergens.includes(allergen)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          allergens: [...formData.allergens, allergen],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          allergens: formData.allergens.filter(
                            (a) => a !== allergen
                          ),
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{allergen}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {commonDietaryTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.dietaryTags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          dietaryTags: [...formData.dietaryTags, tag],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          dietaryTags: formData.dietaryTags.filter(
                            (t) => t !== tag
                          ),
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Item"
                : "Create Item"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

