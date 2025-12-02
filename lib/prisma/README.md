# Prisma Query Utilities

A reusable, type-safe utility library for common Prisma database operations with automatic ownership verification.

## Features

- ✅ **Type-safe queries** - Full TypeScript support with Prisma types
- ✅ **Automatic ownership verification** - Ensures users can only access their own resources
- ✅ **Reusable patterns** - Common CRUD operations for Menu, Category, and MenuItem
- ✅ **Extensible** - Generic query builder can be used for other models
- ✅ **Transaction support** - Built-in transaction helpers

## Quick Start

### Basic Usage

```typescript
import { menuQueries } from '@/lib/prisma'

// Get all categories for a menu
const categories = await menuQueries.getCategoriesByMenu(menuId, userId)

// Create a menu item
const item = await menuQueries.createMenuItem(categoryId, userId, {
  name: 'Pizza Margherita',
  price: 12.99,
  description: 'Classic Italian pizza',
  isVegetarian: true,
  spiceLevel: 'MILD'
})

// Update a menu item
const updated = await menuQueries.updateMenuItem(itemId, userId, {
  price: 14.99,
  isAvailable: false
})

// Delete a menu item
await menuQueries.deleteMenuItem(itemId, userId)
```

### In API Routes

```typescript
// app/api/menus/categories/[categoryId]/items/route.ts
import { menuQueries } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { categoryId } = await params
  const data = await req.json()

  try {
    const item = await menuQueries.createMenuItem(categoryId, session.user.id, data)
    return NextResponse.json({ menuItem: item })
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## API Reference

### Menu Queries

#### `getUserMenus(userId, options?)`
Get all menus for a user's restaurants with categories and items.

```typescript
const menus = await menuQueries.getUserMenus(userId, {
  orderBy: { createdAt: 'desc' },
  take: 10
})
```

#### `getMenuById(menuId, userId)`
Get a single menu by ID with ownership verification.

```typescript
const menu = await menuQueries.getMenuById(menuId, userId)
```

### Category Queries

#### `getCategoriesByMenu(menuId, userId, options?)`
Get all categories for a menu with items.

```typescript
const categories = await menuQueries.getCategoriesByMenu(menuId, userId, {
  orderBy: { displayOrder: 'asc' }
})
```

#### `getCategoryById(categoryId, userId)`
Get a single category by ID.

#### `createCategory(menuId, userId, data)`
Create a new category.

```typescript
const category = await menuQueries.createCategory(menuId, userId, {
  name: 'Appetizers',
  description: 'Start your meal right',
  displayOrder: 1
})
```

#### `updateCategory(categoryId, userId, data)`
Update a category.

#### `deleteCategory(categoryId, userId)`
Delete a category.

### Menu Item Queries

#### `getMenuItemsByCategory(categoryId, userId, options?)`
Get all menu items for a category.

```typescript
const items = await menuQueries.getMenuItemsByCategory(categoryId, userId)
```

#### `getMenuItemById(itemId, userId)`
Get a single menu item by ID.

#### `createMenuItem(categoryId, userId, data)`
Create a new menu item.

```typescript
const item = await menuQueries.createMenuItem(categoryId, userId, {
  name: 'Pizza Margherita',
  price: 12.99,
  description: 'Classic Italian pizza',
  image: ['https://example.com/pizza.jpg'],
  allergens: ['gluten', 'dairy'],
  dietaryTags: ['vegetarian'],
  spiceLevel: 'MILD',
  isVegetarian: true,
  preparationTime: 20,
  displayOrder: 1
})
```

#### `updateMenuItem(itemId, userId, data)`
Update a menu item.

```typescript
const updated = await menuQueries.updateMenuItem(itemId, userId, {
  price: 14.99,
  isAvailable: false
})
```

#### `deleteMenuItem(itemId, userId)`
Delete a menu item.

#### `bulkCreateMenuItems(categoryId, userId, items)`
Create multiple menu items at once.

```typescript
const items = await menuQueries.bulkCreateMenuItems(categoryId, userId, [
  { name: 'Item 1', price: 10.99 },
  { name: 'Item 2', price: 12.99 },
  { name: 'Item 3', price: 15.99 }
])
```

## Ownership Verification

All queries automatically verify ownership. If a user tries to access a resource they don't own, an error is thrown.

```typescript
import { ownership } from '@/lib/prisma'

// Manual verification
const hasAccess = await ownership.verifyMenuItemOwnership(itemId, userId)
if (!hasAccess) {
  throw new Error('Access denied')
}

// Get ownership filters for custom queries
const filter = ownership.getMenuItemOwnershipFilter(userId)
const items = await db.menuItem.findMany({
  where: {
    ...filter,
    isAvailable: true
  }
})
```

## Generic Query Builder

For extending to other models, use the generic query builder:

```typescript
import { queryBuilder } from '@/lib/prisma'

// Find many with ownership
const orders = await queryBuilder.findManyWithOwnership(
  'order',
  userId,
  ['restaurant', 'ownerId'],
  {
    where: { status: 'PENDING' },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  }
)

// Create with ownership verification
const reservation = await queryBuilder.createWithOwnership(
  'reservation',
  restaurantId,
  userId,
  'restaurant',
  ['ownerId'],
  {
    date: new Date(),
    guestCount: 4
  }
)
```

## Type Definitions

All functions are fully typed with Prisma-generated types:

```typescript
import type {
  MenuWithCategories,
  CategoryWithItems,
  MenuItemWithRelations,
  CreateMenuItemData,
  UpdateMenuItemData
} from '@/lib/prisma'

const item: MenuItemWithRelations = await menuQueries.getMenuItemById(itemId, userId)
```

## Error Handling

All functions throw descriptive errors:

- `"Menu not found or access denied"` - Ownership verification failed
- `"Category not found or access denied"` - Category doesn't exist or user doesn't own it
- `"Menu item not found or access denied"` - Item doesn't exist or user doesn't own it

Always wrap calls in try-catch blocks:

```typescript
try {
  const item = await menuQueries.createMenuItem(categoryId, userId, data)
  return NextResponse.json({ item })
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
  }
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

## Best Practices

1. **Always pass userId** - Never skip ownership verification
2. **Handle errors gracefully** - Check error messages for specific cases
3. **Use transactions for bulk operations** - Use `queryBuilder.withTransaction()` for multiple related operations
4. **Type your data** - Use the provided TypeScript types for better IDE support
5. **Extend for other models** - Use the generic query builder pattern for new models

## Examples

See the following files for complete examples:
- `app/api/menus/categories/[categoryId]/items/route.ts` - Using in API routes
- `components/menu/premium-menu-editor.tsx` - Using in React components

