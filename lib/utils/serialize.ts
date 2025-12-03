/**
 * Serializes Prisma Decimal fields to numbers for Client Components
 * Next.js cannot serialize Decimal objects from Prisma to Client Components
 */

/**
 * Serialize a restaurant object with Decimal fields
 */
export function serializeRestaurant<T extends { taxRate?: any; serviceCharge?: any; minOrderValue?: any }>(
  restaurant: T
): Omit<T, "taxRate" | "serviceCharge" | "minOrderValue"> & {
  taxRate: number | null
  serviceCharge: number | null
  minOrderValue: number | null
} {
  return {
    ...restaurant,
    taxRate: restaurant.taxRate ? Number(restaurant.taxRate) : null,
    serviceCharge: restaurant.serviceCharge ? Number(restaurant.serviceCharge) : null,
    minOrderValue: restaurant.minOrderValue ? Number(restaurant.minOrderValue) : null,
  }
}

/**
 * Serialize menu items with Decimal price fields
 */
export function serializeMenuItems<T extends { price: any; variants?: any[]; modifiers?: any[] }>(
  items: T[]
): Array<Omit<T, "price" | "variants" | "modifiers"> & {
  price: number
  variants?: Array<{ price: number; [key: string]: any }>
  modifiers?: Array<{ price: number; [key: string]: any }>
}> {
  return items.map((item) => ({
    ...item,
    price: Number(item.price),
    variants: item.variants?.map((variant) => ({
      ...variant,
      price: Number(variant.price),
    })),
    modifiers: item.modifiers?.map((modifier) => ({
      ...modifier,
      price: Number(modifier.price),
    })),
  }))
}

/**
 * Serialize a menu with categories and items
 */
export function serializeMenu<T extends {
  categories?: Array<{
    items?: Array<{ price: any; variants?: any[]; modifiers?: any[]; [key: string]: any }>
    [key: string]: any
  }>
  [key: string]: any
}>(
  menu: T
): T {
  if (!menu.categories) return menu

  return {
    ...menu,
    categories: menu.categories.map((category) => ({
      ...category,
      items: category.items && Array.isArray(category.items)
        ? category.items.map((item) => ({
            ...item,
            price: Number(item.price),
            variants: item.variants && Array.isArray(item.variants)
              ? item.variants.map((variant: any) => ({
                  ...variant,
                  price: Number(variant.price),
                }))
              : item.variants,
            modifiers: item.modifiers && Array.isArray(item.modifiers)
              ? item.modifiers.map((modifier: any) => ({
                  ...modifier,
                  price: Number(modifier.price),
                }))
              : item.modifiers,
          }))
        : category.items,
    })),
  } as T
}

/**
 * Serialize a restaurant with menus
 */
export function serializeRestaurantWithMenus<T extends {
  taxRate?: any
  serviceCharge?: any
  minOrderValue?: any
  menus?: Array<{
    categories?: Array<{
      items?: Array<{ price: any; variants?: any[]; modifiers?: any[] }>
    }>
  }>
}>(
  restaurant: T
): Omit<T, "taxRate" | "serviceCharge" | "minOrderValue" | "menus"> & {
  taxRate: number | null
  serviceCharge: number | null
  minOrderValue: number | null
  menus: Array<ReturnType<typeof serializeMenu>>
} {
  const serialized = serializeRestaurant(restaurant)
  
  return {
    ...serialized,
    menus: restaurant.menus
      ? restaurant.menus.map((menu) => serializeMenu(menu))
      : [],
  }
}

