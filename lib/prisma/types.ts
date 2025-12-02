/**
 * Type definitions for Prisma query utilities
 */

import { Prisma } from "@prisma/client"

// Include types for common queries
export type MenuWithCategories = Prisma.MenuGetPayload<{
  include: {
    categories: {
      include: {
        items: {
          include: {
            variants: true
            modifiers: true
          }
        }
      }
    }
  }
}>

export type CategoryWithItems = Prisma.CategoryGetPayload<{
  include: {
    items: {
      include: {
        variants: true
        modifiers: true
      }
    }
  }
}>

export type MenuItemWithRelations = Prisma.MenuItemGetPayload<{
  include: {
    category: true
    variants: true
    modifiers: true
  }
}>

// Query options
export interface QueryOptions {
  include?: Record<string, boolean | object>
  orderBy?: Record<string, "asc" | "desc">
  skip?: number
  take?: number
}

// Create/Update data types
export interface CreateMenuItemData {
  name: string
  description?: string
  price: number | string
  image?: string[]
  allergens?: string[]
  dietaryTags?: string[]
  spiceLevel?: "MILD" | "MEDIUM" | "HOT" | "EXTRA_HOT"
  customTags?: string[]
  isVegetarian?: boolean
  isVegan?: boolean
  preparationTime?: number | string | null
  displayOrder?: number
  isAvailable?: boolean
}

export interface UpdateMenuItemData extends Partial<CreateMenuItemData> {
  id: string
}

export interface CreateCategoryData {
  name: string
  description?: string
  image?: string
  displayOrder?: number
  isActive?: boolean
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string
}

// Ownership context
export interface OwnershipContext {
  userId: string
}

