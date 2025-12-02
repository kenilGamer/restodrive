/**
 * Ownership verification utilities for Prisma queries
 * Ensures users can only access resources they own
 */

import { db } from "@/lib/db"

/**
 * Verify that a menu belongs to a user's restaurant
 */
export async function verifyMenuOwnership(
  menuId: string,
  userId: string
): Promise<boolean> {
  const menu = await db.menu.findFirst({
    where: {
      id: menuId,
      restaurant: {
        ownerId: userId,
      },
    },
    select: { id: true },
  })

  return !!menu
}

/**
 * Verify that a category belongs to a user's restaurant
 */
export async function verifyCategoryOwnership(
  categoryId: string,
  userId: string
): Promise<boolean> {
  const category = await db.category.findFirst({
    where: {
      id: categoryId,
      menu: {
        restaurant: {
          ownerId: userId,
        },
      },
    },
    select: { id: true },
  })

  return !!category
}

/**
 * Verify that a menu item belongs to a user's restaurant
 */
export async function verifyMenuItemOwnership(
  itemId: string,
  userId: string
): Promise<boolean> {
  const item = await db.menuItem.findFirst({
    where: {
      id: itemId,
      category: {
        menu: {
          restaurant: {
            ownerId: userId,
          },
        },
      },
    },
    select: { id: true },
  })

  return !!item
}

/**
 * Get ownership filter for menu queries
 */
export function getMenuOwnershipFilter(userId: string) {
  return {
    restaurant: {
      ownerId: userId,
    },
  }
}

/**
 * Get ownership filter for category queries
 */
export function getCategoryOwnershipFilter(userId: string) {
  return {
    menu: {
      restaurant: {
        ownerId: userId,
      },
    },
  }
}

/**
 * Get ownership filter for menu item queries
 */
export function getMenuItemOwnershipFilter(userId: string) {
  return {
    category: {
      menu: {
        restaurant: {
          ownerId: userId,
        },
      },
    },
  }
}

