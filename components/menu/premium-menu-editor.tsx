"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, Edit, Trash2, Image as ImageIcon, Tag, DollarSign, ToggleLeft, ToggleRight, Eye, Power } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { MenuWithCategories } from "@/types"

interface PremiumMenuEditorProps {
  menu: MenuWithCategories
  restaurantSlug: string
}

export function PremiumMenuEditor({ menu: initialMenu, restaurantSlug }: PremiumMenuEditorProps) {
  const [menu, setMenu] = useState(initialMenu)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    menu.categories[0]?.id || null
  )
  const [showDishModal, setShowDishModal] = useState(false)
  const [editingDish, setEditingDish] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activating, setActivating] = useState(false)

  const selectedCategoryData = menu.categories.find((cat) => cat.id === selectedCategory)

  const handleToggleActive = async () => {
    setActivating(true)
    try {
      const response = await fetch(`/api/menus/${menu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: menu.name,
          description: menu.description,
          isActive: !menu.isActive,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update menu")
      }

      setMenu({ ...menu, isActive: !menu.isActive })
    } catch (error: any) {
      console.error("Error toggling menu:", error)
      alert(error.message || "Failed to update menu. Please try again.")
    } finally {
      setActivating(false)
    }
  }

  const handleSaveDish = async (dishData: any) => {
    if (!selectedCategory) {
      alert("Please select a category first")
      return
    }

    setLoading(true)
    try {
      const url = editingDish
        ? `/api/menus/items/${editingDish.id}`
        : `/api/menus/categories/${selectedCategory}/items`
      const method = editingDish ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dishData.name,
          description: dishData.description,
          price: parseFloat(dishData.price) || 0,
          image: dishData.image || [],
          dietaryTags: dishData.dietaryTags || [],
          allergens: [],
          isAvailable: dishData.isAvailable ?? true,
          preparationTime: null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save dish")
      }

      // Update menu state
      if (editingDish) {
        // Update existing item
        setMenu({
          ...menu,
          categories: menu.categories.map((cat) =>
            cat.id === selectedCategory
              ? {
                  ...cat,
                  items: cat.items.map((item) =>
                    item.id === editingDish.id ? data.menuItem || data.item : item
                  ),
                }
              : cat
          ),
        })
      } else {
        // Add new item
        setMenu({
          ...menu,
          categories: menu.categories.map((cat) =>
            cat.id === selectedCategory
              ? {
                  ...cat,
                  items: [...cat.items, data.menuItem || data.item],
                }
              : cat
          ),
        })
      }

      setShowDishModal(false)
      setEditingDish(null)
    } catch (error: any) {
      console.error("Error saving dish:", error)
      alert(error.message || "Failed to save dish. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-semibold text-white">{menu.name}</h1>
            <button
              onClick={handleToggleActive}
              disabled={activating}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                menu.isActive
                  ? "bg-[#11C97A]/20 border border-[#11C97A]/30 text-[#11C97A] hover:bg-[#11C97A]/30"
                  : "bg-[#2A2A2A] border border-[#2A2A2A] text-gray-400 hover:bg-[#2A2A2A]/80"
              }`}
              title={menu.isActive ? "Deactivate menu" : "Activate menu"}
            >
              <Power className={`h-4 w-4 ${menu.isActive ? "text-[#11C97A]" : "text-gray-500"}`} />
              {menu.isActive ? "Active" : "Inactive"}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-400">Manage your menu categories and dishes</p>
        </div>
        <div className="flex items-center gap-2">
          {menu.isActive && (
            <Button
              asChild
              variant="outline"
              className="border-[#2A2A2A] text-gray-400 hover:text-white hover:border-cyan-500/50"
            >
              <Link 
                href={`/qr/${restaurantSlug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!restaurantSlug) {
                    e.preventDefault()
                    alert("Restaurant slug is missing. Please check your settings.")
                    return
                  }
                  console.log("Preview clicked, navigating to:", `/qr/${restaurantSlug}`)
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
          )}
          <Button
            onClick={() => {
              if (!selectedCategory) {
                alert("Please select a category first")
                return
              }
              setEditingDish(null)
              setShowDishModal(true)
            }}
            disabled={!selectedCategory || loading}
            className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0 shadow-glow disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {menu.categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full p-4 rounded-[12px] border transition-all duration-200 text-left ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-[#FCD34D]/20 to-[#FCD34D]/10 border-[#FCD34D]/50 shadow-glow-colored"
                        : "bg-[#0D0D0D] border-[#2A2A2A] hover:border-[#2A2A2A]/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold text-sm ${selectedCategory === category.id ? "text-[#FCD34D]" : "text-white"}`}>
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {category.items.length} dishes
                        </p>
                      </div>
                      {selectedCategory === category.id && (
                        <div className="h-2 w-2 rounded-full bg-[#FCD34D]"></div>
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
              <Button
                variant="ghost"
                className="w-full mt-2 text-gray-400 hover:text-white hover:bg-[#2A2A2A] border border-dashed border-[#2A2A2A]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dishes Grid */}
        <div className="lg:col-span-3">
          {selectedCategoryData ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {selectedCategoryData.name} ({selectedCategoryData.items.length})
                </h2>
              </div>
              {selectedCategoryData.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {selectedCategoryData.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow hover:shadow-glow-lg transition-all duration-200 overflow-hidden group cursor-pointer">
                          <div className="relative h-48 bg-[#0D0D0D]">
                            {item.image && item.image.length > 0 ? (
                              <Image
                                src={item.image[0]}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-600" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <div className={`p-2 rounded-full ${item.isAvailable ? "bg-[#11C97A]/20" : "bg-[#FF6A55]/20"}`}>
                                {item.isAvailable ? (
                                  <ToggleRight className="h-4 w-4 text-[#11C97A]" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4 text-[#FF6A55]" />
                                )}
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-white text-sm line-clamp-1">{item.name}</h3>
                              <span className="text-[#11C97A] font-bold text-sm">
                                {formatCurrency(Number(item.price))}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2 mb-3">{item.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.dietaryTags?.slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs rounded-full bg-[#2A2A2A] text-gray-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#2A2A2A]">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingDish(item)
                                  setShowDishModal(true)
                                }}
                                className="flex-1 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-400 hover:bg-[#2A2A2A]"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
                  <CardContent className="p-12 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No dishes in this category yet</p>
                    <Button
                      onClick={() => {
                        setEditingDish(null)
                        setShowDishModal(true)
                      }}
                      disabled={loading}
                      className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Dish
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
              <CardContent className="p-12 text-center">
                <p className="text-gray-400">Select a category to view dishes</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Dish Modal */}
      {showDishModal && (
        <DishModal
          dish={editingDish}
          categoryId={selectedCategory}
          onClose={() => {
            setShowDishModal(false)
            setEditingDish(null)
          }}
          onSave={handleSaveDish}
        />
      )}
    </div>
  )
}

interface DishModalProps {
  dish?: any
  categoryId: string | null
  onClose: () => void
  onSave: (dish: any) => void
}

function DishModal({ dish, categoryId, onClose, onSave }: DishModalProps) {
  const [formData, setFormData] = useState({
    name: dish?.name || "",
    description: dish?.description || "",
    price: dish?.price || "",
    image: dish?.image || [],
    isAvailable: dish?.isAvailable ?? true,
    dietaryTags: dish?.dietaryTags || [],
    ingredients: dish?.ingredients || "",
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      // Add image URL to the images array
      setFormData({
        ...formData,
        image: [...formData.image, data.imageUrl],
      })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(error.message || "Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      image: formData.image.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a dish name")
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("Please enter a valid price")
      return
    }
    if (!categoryId) {
      alert("Please select a category first")
      return
    }

    setSaving(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error("Error in handleSave:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[22px] shadow-glow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {dish ? "Edit Dish" : "Add New Dish"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              ×
            </Button>
          </div>

          {!categoryId && (
            <div className="mb-6 p-4 rounded-[12px] bg-[#FF6A55]/20 border border-[#FF6A55]/50">
              <p className="text-sm text-[#FF6A55]">
                ⚠️ Please select a category first before adding a dish
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Dish Images</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-[12px] p-8 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-[#C97AFF] bg-[#C97AFF]/10"
                    : "border-[#2A2A2A] hover:border-[#C97AFF]/50"
                } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInput}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 10MB</p>
                </label>
              </div>
              
              {/* Image Preview */}
              {formData.image.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.image.map((imgUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-[12px] overflow-hidden border border-[#2A2A2A] bg-[#0D0D0D]">
                        <img
                          src={imgUrl}
                          alt={`Dish image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Dish Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C97AFF] transition-colors"
                placeholder="e.g., Margherita Pizza"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C97AFF] transition-colors resize-none"
                placeholder="Describe your dish..."
              />
            </div>

            {/* Price & Availability */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C97AFF] transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Availability</label>
                <button
                  onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                  className={`w-full px-4 py-3 rounded-[12px] border transition-all ${
                    formData.isAvailable
                      ? "bg-[#11C97A]/20 border-[#11C97A]/50 text-[#11C97A]"
                      : "bg-[#FF6A55]/20 border-[#FF6A55]/50 text-[#FF6A55]"
                  }`}
                >
                  {formData.isAvailable ? "Available" : "Unavailable"}
                </button>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Ingredients</label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C97AFF] transition-colors"
                placeholder="Comma separated ingredients"
              />
            </div>

            {/* Dietary Tags */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Dietary Tags</label>
              <div className="flex flex-wrap gap-2">
                {["Vegetarian", "Vegan", "Gluten-Free", "Spicy"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const tags = formData.dietaryTags.includes(tag)
                        ? formData.dietaryTags.filter((t: string) => t !== tag)
                        : [...formData.dietaryTags, tag]
                      setFormData({ ...formData, dietaryTags: tags })
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      formData.dietaryTags.includes(tag)
                        ? "bg-[#C97AFF]/20 text-[#C97AFF] border border-[#C97AFF]/50"
                        : "bg-[#2A2A2A] text-gray-400 border border-[#2A2A2A]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#2A2A2A]">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !categoryId}
                className="flex-1 bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0 disabled:opacity-50"
              >
                {saving ? "Saving..." : dish ? "Update Dish" : "Add Dish"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

