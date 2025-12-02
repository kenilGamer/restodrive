/**
 * Prisma Query Utilities - Main Export
 * 
 * Provides reusable, type-safe database operations with automatic
 * ownership verification for Menu, Category, and MenuItem models.
 * 
 * @example
 * ```ts
 * import { menuQueries } from '@/lib/prisma'
 * 
 * // Get all categories for a menu
 * const categories = await menuQueries.getCategoriesByMenu(menuId, userId)
 * 
 * // Create a menu item
 * const item = await menuQueries.createMenuItem(categoryId, userId, {
 *   name: 'Pizza Margherita',
 *   price: 12.99,
 *   description: 'Classic Italian pizza'
 * })
 * ```
 */

// Export all menu-related queries
export * as menuQueries from "./menu-queries"

// Export ownership utilities
export * as ownership from "./ownership"

// Export generic query builder
export * as queryBuilder from "./query-builder"

// Export types
export * from "./types"

// Convenience re-exports
export {
  getUserMenus,
  getMenuById,
  getCategoriesByMenu,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItemsByCategory,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  bulkCreateMenuItems,
} from "./menu-queries"

export {
  verifyMenuOwnership,
  verifyCategoryOwnership,
  verifyMenuItemOwnership,
  getMenuOwnershipFilter,
  getCategoryOwnershipFilter,
  getMenuItemOwnershipFilter,
} from "./ownership"

