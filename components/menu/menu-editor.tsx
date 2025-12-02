"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, Edit, Trash2 } from "lucide-react"
import { CategoryEditor } from "./category-editor"
import { ItemEditor } from "./item-editor"
import type { MenuWithCategories } from "@/types"

interface MenuEditorProps {
  menu: MenuWithCategories
}

export function MenuEditor({ menu: initialMenu }: MenuEditorProps) {
  const [menu, setMenu] = useState(initialMenu)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [showCategoryEditor, setShowCategoryEditor] = useState(false)
  const [showItemEditor, setShowItemEditor] = useState(false)

  const handleCategoryCreated = (category: any) => {
    setMenu({
      ...menu,
      categories: [...menu.categories, category],
    })
    setShowCategoryEditor(false)
  }

  const handleItemCreated = (item: any) => {
    setMenu({
      ...menu,
      categories: menu.categories.map((cat) =>
        cat.id === selectedCategory
          ? { ...cat, items: [...cat.items, item] }
          : cat
      ),
    })
    setShowItemEditor(false)
    setSelectedCategory(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Categories Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Categories</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowCategoryEditor(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {menu.categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedCategory === category.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-gray-500">
                        {category.items.length} items
                      </p>
                    </div>
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
              {menu.categories.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No categories yet. Create one to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items List */}
      <div className="lg:col-span-2">
        {selectedCategory ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {
                      menu.categories.find((c) => c.id === selectedCategory)
                        ?.name
                    }
                  </CardTitle>
                  <CardDescription>
                    {
                      menu.categories.find((c) => c.id === selectedCategory)
                        ?.items.length
                    }{" "}
                    items
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowItemEditor(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {menu.categories
                  .find((c) => c.id === selectedCategory)
                  ?.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {item.image && item.image.length > 0 && (
                            <img
                              src={item.image[0]}
                              alt={item.name}
                              className="w-16 h-16 rounded-md object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {item.description}
                            </p>
                            <p className="text-sm font-medium text-primary mt-1">
                              ₹{Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedItem(item.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (
                              confirm(
                                "Are you sure you want to delete this item?"
                              )
                            ) {
                              try {
                                await fetch(`/api/menus/items/${item.id}`, {
                                  method: "DELETE",
                                })
                                setMenu({
                                  ...menu,
                                  categories: menu.categories.map((cat) =>
                                    cat.id === selectedCategory
                                      ? {
                                          ...cat,
                                          items: cat.items.filter(
                                            (i) => i.id !== item.id
                                          ),
                                        }
                                      : cat
                                  ),
                                })
                              } catch (error) {
                                console.error("Error deleting item:", error)
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {menu.categories.find((c) => c.id === selectedCategory)
                  ?.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items in this category yet.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowItemEditor(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Item
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">
                Select a category to view and manage items
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Editor Panel */}
      <div className="lg:col-span-1">
        {showCategoryEditor && (
          <CategoryEditor
            menuId={menu.id}
            onClose={() => setShowCategoryEditor(false)}
            onSuccess={handleCategoryCreated}
          />
        )}
        {showItemEditor && selectedCategory && (
          <ItemEditor
            categoryId={selectedCategory}
            onClose={() => {
              setShowItemEditor(false)
              setSelectedCategory(null)
            }}
            onSuccess={handleItemCreated}
          />
        )}
        {selectedItem && (
          <ItemEditor
            itemId={selectedItem}
            categoryId={
              menu.categories.find((c) =>
                c.items.some((i) => i.id === selectedItem)
              )?.id || ""
            }
            onClose={() => setSelectedItem(null)}
            onSuccess={(item) => {
              setMenu({
                ...menu,
                categories: menu.categories.map((cat) => ({
                  ...cat,
                  items: cat.items.map((i) => (i.id === item.id ? item : i)),
                })),
              })
              setSelectedItem(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

