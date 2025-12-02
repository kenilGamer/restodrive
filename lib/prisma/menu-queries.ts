/**
 * Reusable Prisma queries for Menu, Category, and MenuItem operations
 * Provides type-safe, ownership-verified database operations
 */

import { db } from "@/lib/db"
import {
  verifyMenuOwnership,
  verifyCategoryOwnership,
  verifyMenuItemOwnership,
  getMenuOwnershipFilter,
  getCategoryOwnershipFilter,
  getMenuItemOwnershipFilter,
} from "./ownership"
import type {
  MenuWithCategories,
  CategoryWithItems,
  MenuItemWithRelations,
  CreateMenuItemData,
  UpdateMenuItemData,
  CreateCategoryData,
  UpdateCategoryData,
  QueryOptions,
} from "./types"

// ============================================
// MENU QUERIES
// ============================================

/**
 * Get all menus for a user's restaurants with categories and items
 */
export async function getUserMenus(
  userId: string,
  options?: QueryOptions
): Promise<MenuWithCategories[]> {
  return db.menu.findMany({
    where: getMenuOwnershipFilter(userId),
    include: {
      categories: {
        include: {
          items: {
            include: {
              variants: true,
              modifiers: true,
            },
          },
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
    orderBy: options?.orderBy || { createdAt: "desc" },
    skip: options?.skip,
    take: options?.take,
  })
}

/**
 * Get a single menu by ID with ownership verification
 */
export async function getMenuById(
  menuId: string,
  userId: string
): Promise<MenuWithCategories | null> {
  const menu = await db.menu.findFirst({
    where: {
      id: menuId,
      ...getMenuOwnershipFilter(userId),
    },
    include: {
      categories: {
        include: {
          items: {
            include: {
              variants: true,
              modifiers: true,
            },
          },
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
  })

  return menu
}

// ============================================
// CATEGORY QUERIES
// ============================================

/**
 * Get all categories for a menu with items
 */
export async function getCategoriesByMenu(
  menuId: string,
  userId: string,
  options?: QueryOptions
): Promise<CategoryWithItems[]> {
  // Verify ownership first
  const hasAccess = await verifyMenuOwnership(menuId, userId)
  if (!hasAccess) {
    throw new Error("Menu not found or access denied")
  }

  return db.category.findMany({
    where: {
      menuId,
    },
    include: {
      items: {
        include: {
          variants: true,
          modifiers: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
    orderBy: options?.orderBy || { displayOrder: "asc" },
    skip: options?.skip,
    take: options?.take,
  })
}

/**
 * Get a single category by ID with ownership verification
 */
export async function getCategoryById(
  categoryId: string,
  userId: string
): Promise<CategoryWithItems | null> {
  return db.category.findFirst({
    where: {
      id: categoryId,
      ...getCategoryOwnershipFilter(userId),
    },
    include: {
      items: {
        include: {
          variants: true,
          modifiers: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
  })
}

/**
 * Create a new category
 */
export async function createCategory(
  menuId: string,
  userId: string,
  data: CreateCategoryData
) {
  // Verify ownership
  const hasAccess = await verifyMenuOwnership(menuId, userId)
  if (!hasAccess) {
    throw new Error("Menu not found or access denied")
  }

  return db.category.create({
    data: {
      name: data.name,
      description: data.description,
      image: data.image,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
      menuId,
    },
    include: {
      items: true,
    },
  })
}

/**
 * Update a category
 */
export async function updateCategory(
  categoryId: string,
  userId: string,
  data: Partial<CreateCategoryData>
) {
  // Verify ownership
  const hasAccess = await verifyCategoryOwnership(categoryId, userId)
  if (!hasAccess) {
    throw new Error("Category not found or access denied")
  }

  return db.category.update({
    where: { id: categoryId },
    data: {
      name: data.name,
      description: data.description,
      image: data.image,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    },
    include: {
      items: true,
    },
  })
}

/**
 * Delete a category
 */
export async function deleteCategory(categoryId: string, userId: string) {
  // Verify ownership
  const hasAccess = await verifyCategoryOwnership(categoryId, userId)
  if (!hasAccess) {
    throw new Error("Category not found or access denied")
  }

  return db.category.delete({
    where: { id: categoryId },
  })
}

// ============================================
// MENU ITEM QUERIES
// ============================================

/**
 * Get all menu items for a category
 */
export async function getMenuItemsByCategory(
  categoryId: string,
  userId: string,
  options?: QueryOptions
): Promise<MenuItemWithRelations[]> {
  // Verify ownership
  const hasAccess = await verifyCategoryOwnership(categoryId, userId)
  if (!hasAccess) {
    throw new Error("Category not found or access denied")
  }

  return db.menuItem.findMany({
    where: {
      categoryId,
    },
    include: {
      category: true,
      variants: true,
      modifiers: true,
    },
    orderBy: options?.orderBy || { displayOrder: "asc" },
    skip: options?.skip,
    take: options?.take,
  })
}

/**
 * Get a single menu item by ID with ownership verification
 */
export async function getMenuItemById(
  itemId: string,
  userId: string
): Promise<MenuItemWithRelations | null> {
  return db.menuItem.findFirst({
    where: {
      id: itemId,
      ...getMenuItemOwnershipFilter(userId),
    },
    include: {
      category: true,
      variants: true,
      modifiers: true,
    },
  })
}

/**
 * Create a new menu item
 */
export async function createMenuItem(
  categoryId: string,
  userId: string,
  data: CreateMenuItemData
) {
  // Verify ownership
  const hasAccess = await verifyCategoryOwnership(categoryId, userId)
  if (!hasAccess) {
    throw new Error("Category not found or access denied")
  }

  return db.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      price: typeof data.price === "string" ? parseFloat(data.price) : data.price,
      image: data.image || [],
      allergens: data.allergens || [],
      dietaryTags: data.dietaryTags || [],
      spiceLevel: data.spiceLevel || "MILD",
      customTags: data.customTags || [],
      isVegetarian: data.isVegetarian ?? false,
      isVegan: data.isVegan ?? false,
      preparationTime: data.preparationTime
        ? typeof data.preparationTime === "string"
          ? parseInt(data.preparationTime)
          : data.preparationTime
        : null,
      displayOrder: data.displayOrder ?? 0,
      isAvailable: data.isAvailable ?? true,
      categoryId,
    },
    include: {
      category: true,
      variants: true,
      modifiers: true,
    },
  })
}

/**
 * Update a menu item
 */
export async function updateMenuItem(
  itemId: string,
  userId: string,
  data: Partial<CreateMenuItemData>
) {
  // Verify ownership
  const hasAccess = await verifyMenuItemOwnership(itemId, userId)
  if (!hasAccess) {
    throw new Error("Menu item not found or access denied")
  }

  const updateData: any = {}

  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.price !== undefined) {
    updateData.price =
      typeof data.price === "string" ? parseFloat(data.price) : data.price
  }
  if (data.image !== undefined) updateData.image = data.image
  if (data.allergens !== undefined) updateData.allergens = data.allergens
  if (data.dietaryTags !== undefined) updateData.dietaryTags = data.dietaryTags
  if (data.spiceLevel !== undefined) updateData.spiceLevel = data.spiceLevel
  if (data.customTags !== undefined) updateData.customTags = data.customTags
  if (data.isVegetarian !== undefined) updateData.isVegetarian = data.isVegetarian
  if (data.isVegan !== undefined) updateData.isVegan = data.isVegan
  if (data.preparationTime !== undefined) {
    updateData.preparationTime =
      data.preparationTime === null
        ? null
        : typeof data.preparationTime === "string"
          ? parseInt(data.preparationTime)
          : data.preparationTime
  }
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder
  if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable

  return db.menuItem.update({
    where: { id: itemId },
    data: updateData,
    include: {
      category: true,
      variants: true,
      modifiers: true,
    },
  })
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(itemId: string, userId: string) {
  // Verify ownership
  const hasAccess = await verifyMenuItemOwnership(itemId, userId)
  if (!hasAccess) {
    throw new Error("Menu item not found or access denied")
  }

  return db.menuItem.delete({
    where: { id: itemId },
  })
}

/**
 * Bulk create menu items
 */
export async function bulkCreateMenuItems(
  categoryId: string,
  userId: string,
  items: CreateMenuItemData[]
) {
  // Verify ownership
  const hasAccess = await verifyCategoryOwnership(categoryId, userId)
  if (!hasAccess) {
    throw new Error("Category not found or access denied")
  }

  return db.menuItem.createMany({
    data: items.map((item) => ({
      name: item.name,
      description: item.description,
      price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
      image: item.image || [],
      allergens: item.allergens || [],
      dietaryTags: item.dietaryTags || [],
      spiceLevel: item.spiceLevel || "MILD",
      customTags: item.customTags || [],
      isVegetarian: item.isVegetarian ?? false,
      isVegan: item.isVegan ?? false,
      preparationTime: item.preparationTime
        ? typeof item.preparationTime === "string"
          ? parseInt(item.preparationTime)
          : item.preparationTime
        : null,
      displayOrder: item.displayOrder ?? 0,
      isAvailable: item.isAvailable ?? true,
      categoryId,
    })),
  })
}

