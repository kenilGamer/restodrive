# Migration Guide: Refactoring to Prisma Query Utilities

This guide shows how to refactor existing API routes to use the new Prisma query utilities.

## Before & After Examples

### Example 1: Creating a Menu Item

#### Before (77 lines)
```typescript
export async function POST(req: Request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { categoryId } = await params
    const body = await req.json()

    // Manual ownership verification
    const category = await db.category.findFirst({
      where: {
        id: categoryId,
        menu: {
          restaurant: {
            ownerId: session.user.id,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Manual data transformation
    const {
      name,
      description,
      price,
      image,
      allergens,
      dietaryTags,
      spiceLevel,
      customTags,
      isVegetarian,
      isVegan,
      preparationTime,
      displayOrder,
    } = body

    // Manual Prisma query
    const menuItem = await db.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || [],
        allergens: allergens || [],
        dietaryTags: dietaryTags || [],
        spiceLevel: spiceLevel || "MILD",
        customTags: customTags || [],
        isVegetarian: isVegetarian || false,
        isVegan: isVegan || false,
        preparationTime: preparationTime ? parseInt(preparationTime) : null,
        displayOrder: displayOrder ?? 0,
        categoryId,
      },
    })

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

#### After (30 lines)
```typescript
import { menuQueries } from "@/lib/prisma"

export async function POST(req: Request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { categoryId } = await params
    const body = await req.json()

    // Single line replaces all the above!
    const menuItem = await menuQueries.createMenuItem(
      categoryId,
      session.user.id,
      body
    )

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error("Error creating menu item:", error)
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### Example 2: Getting Categories

#### Before
```typescript
export async function GET(req: Request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { menuId } = await params

  // Manual ownership verification
  const menu = await db.menu.findFirst({
    where: {
      id: menuId,
      restaurant: {
        ownerId: session.user.id,
      },
    },
  })

  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 })
  }

  // Manual query with includes
  const categories = await db.category.findMany({
    where: { menuId },
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
  })

  return NextResponse.json({ categories })
}
```

#### After
```typescript
import { menuQueries } from "@/lib/prisma"

export async function GET(req: Request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { menuId } = await params

  try {
    const categories = await menuQueries.getCategoriesByMenu(
      menuId,
      session.user.id
    )
    return NextResponse.json({ categories })
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

## Step-by-Step Migration

### Step 1: Import the utilities
```typescript
import { menuQueries } from "@/lib/prisma"
```

### Step 2: Replace manual ownership checks
**Before:**
```typescript
const category = await db.category.findFirst({
  where: {
    id: categoryId,
    menu: {
      restaurant: {
        ownerId: session.user.id,
      },
    },
  },
})
```

**After:**
```typescript
// Ownership is automatically verified in the query function
const category = await menuQueries.getCategoryById(categoryId, session.user.id)
```

### Step 3: Replace manual data transformation
**Before:**
```typescript
const menuItem = await db.menuItem.create({
  data: {
    name,
    description,
    price: parseFloat(price),
    image: image || [],
    allergens: allergens || [],
    // ... more manual transformations
  },
})
```

**After:**
```typescript
// Data transformation is automatic
const menuItem = await menuQueries.createMenuItem(categoryId, userId, body)
```

### Step 4: Update error handling
**Before:**
```typescript
if (!category) {
  return NextResponse.json({ error: "Category not found" }, { status: 404 })
}
```

**After:**
```typescript
try {
  const category = await menuQueries.getCategoryById(categoryId, userId)
  // ...
} catch (error) {
  if (error instanceof Error && error.message.includes("not found")) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    )
  }
}
```

## Files to Migrate

### High Priority (Most Repetitive)
1. `app/api/menus/categories/[categoryId]/items/route.ts` - Create menu item
2. `app/api/menus/items/[itemId]/route.ts` - Get/Update/Delete menu item
3. `app/api/menus/[menuId]/categories/route.ts` - Get/Create categories

### Medium Priority
4. `app/api/menus/[menuId]/route.ts` - Get/Update menu
5. `app/api/menus/route.ts` - List menus

### Low Priority (Already Simple)
6. Other menu-related routes

## Migration Checklist

- [ ] Import `menuQueries` from `@/lib/prisma`
- [ ] Replace manual ownership verification
- [ ] Replace manual data transformation
- [ ] Update error handling to catch utility errors
- [ ] Test all CRUD operations
- [ ] Verify type safety in IDE
- [ ] Update any related tests

## Benefits After Migration

1. **60% less code** - Reduced from ~77 lines to ~30 lines per route
2. **Consistent patterns** - All routes use the same query functions
3. **Type safety** - Full TypeScript support with IntelliSense
4. **Easier testing** - Mock the utility functions instead of Prisma
5. **Better maintainability** - Changes in one place affect all routes
6. **Automatic updates** - New features (like bulk operations) available everywhere

## Common Patterns

### Pattern 1: Create Operation
```typescript
const item = await menuQueries.createMenuItem(categoryId, userId, data)
```

### Pattern 2: Read Operation
```typescript
const item = await menuQueries.getMenuItemById(itemId, userId)
```

### Pattern 3: Update Operation
```typescript
const updated = await menuQueries.updateMenuItem(itemId, userId, data)
```

### Pattern 4: Delete Operation
```typescript
await menuQueries.deleteMenuItem(itemId, userId)
```

### Pattern 5: List Operation
```typescript
const items = await menuQueries.getMenuItemsByCategory(categoryId, userId)
```

## Troubleshooting

### Error: "Category not found or access denied"
- Check that `userId` is correct
- Verify the category exists
- Ensure the user owns the restaurant

### Error: Type errors
- Make sure you're using the correct types from `@/lib/prisma`
- Check that your data matches `CreateMenuItemData` or `UpdateMenuItemData`

### Error: Function not found
- Ensure you've imported from `@/lib/prisma`
- Check that the function name matches the API reference

## Next Steps

After migrating all routes:
1. Consider extending utilities for other models (Orders, Reservations, etc.)
2. Add bulk operations where needed
3. Create custom query functions for complex operations
4. Add caching layer if needed
5. Add logging/monitoring hooks

