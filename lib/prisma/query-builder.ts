/**
 * Generic query builder for reusable Prisma operations
 * Can be extended to other models beyond Menu/Category/Item
 */

import { Prisma } from "@prisma/client"
import { db } from "@/lib/db"

/**
 * Generic ownership filter builder
 * Creates nested ownership filters for any model with restaurant relationship
 */
export function buildOwnershipFilter<T extends Record<string, any>>(
  userId: string,
  path: string[] = ["restaurant", "ownerId"]
): T {
  const filter: any = {}
  let current = filter

  for (let i = 0; i < path.length - 1; i++) {
    current[path[i]] = {}
    current = current[path[i]]
  }

  current[path[path.length - 1]] = userId

  return filter as T
}

/**
 * Generic findMany with ownership check
 */
export async function findManyWithOwnership<T>(
  model: keyof typeof db,
  userId: string,
  ownershipPath: string[],
  options?: {
    where?: Record<string, any>
    include?: Record<string, any>
    orderBy?: Record<string, any>
    skip?: number
    take?: number
  }
): Promise<T[]> {
  const ownershipFilter = buildOwnershipFilter(userId, ownershipPath)
  const where = { ...options?.where, ...ownershipFilter }

  const query: any = {
    where,
  }

  if (options?.include) query.include = options.include
  if (options?.orderBy) query.orderBy = options.orderBy
  if (options?.skip !== undefined) query.skip = options.skip
  if (options?.take !== undefined) query.take = options.take

  return (db[model] as any).findMany(query)
}

/**
 * Generic findFirst with ownership check
 */
export async function findFirstWithOwnership<T>(
  model: keyof typeof db,
  id: string,
  userId: string,
  ownershipPath: string[],
  options?: {
    include?: Record<string, any>
  }
): Promise<T | null> {
  const ownershipFilter = buildOwnershipFilter(userId, ownershipPath)

  const query: any = {
    where: {
      id,
      ...ownershipFilter,
    },
  }

  if (options?.include) query.include = options.include

  return (db[model] as any).findFirst(query)
}

/**
 * Generic create with ownership verification
 */
export async function createWithOwnership<T>(
  model: keyof typeof db,
  parentId: string,
  userId: string,
  parentModel: keyof typeof db,
  parentOwnershipPath: string[],
  data: Record<string, any>,
  options?: {
    include?: Record<string, any>
  }
): Promise<T> {
  // Verify parent ownership
  const parentOwnershipFilter = buildOwnershipFilter(userId, parentOwnershipPath)
  const parent = await (db[parentModel] as any).findFirst({
    where: {
      id: parentId,
      ...parentOwnershipFilter,
    },
    select: { id: true },
  })

  if (!parent) {
    throw new Error("Parent resource not found or access denied")
  }

  const query: any = {
    data,
  }

  if (options?.include) query.include = options.include

  return (db[model] as any).create(query)
}

/**
 * Generic update with ownership verification
 */
export async function updateWithOwnership<T>(
  model: keyof typeof db,
  id: string,
  userId: string,
  ownershipPath: string[],
  data: Record<string, any>,
  options?: {
    include?: Record<string, any>
  }
): Promise<T> {
  // Verify ownership
  const ownershipFilter = buildOwnershipFilter(userId, ownershipPath)
  const existing = await (db[model] as any).findFirst({
    where: {
      id,
      ...ownershipFilter,
    },
    select: { id: true },
  })

  if (!existing) {
    throw new Error("Resource not found or access denied")
  }

  const query: any = {
    where: { id },
    data,
  }

  if (options?.include) query.include = options.include

  return (db[model] as any).update(query)
}

/**
 * Generic delete with ownership verification
 */
export async function deleteWithOwnership<T>(
  model: keyof typeof db,
  id: string,
  userId: string,
  ownershipPath: string[]
): Promise<T> {
  // Verify ownership
  const ownershipFilter = buildOwnershipFilter(userId, ownershipPath)
  const existing = await (db[model] as any).findFirst({
    where: {
      id,
      ...ownershipFilter,
    },
    select: { id: true },
  })

  if (!existing) {
    throw new Error("Resource not found or access denied")
  }

  return (db[model] as any).delete({
    where: { id },
  })
}

/**
 * Transaction helper for multiple operations
 */
export async function withTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return db.$transaction(callback)
}

