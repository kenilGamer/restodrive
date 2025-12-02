-- Add composite indexes for dashboard performance optimization
-- Run this in Supabase SQL Editor

-- Index for restaurant + date queries (used in dashboard stats)
CREATE INDEX IF NOT EXISTS "orders_restaurantId_createdAt_idx" 
ON "orders" ("restaurantId", "createdAt");

-- Index for restaurant + date + payment status queries (used in revenue calculations)
CREATE INDEX IF NOT EXISTS "orders_restaurantId_createdAt_paymentStatus_idx" 
ON "orders" ("restaurantId", "createdAt", "paymentStatus");

-- Verify indexes were created
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'orders' 
    AND indexname LIKE '%restaurantId%createdAt%'
ORDER BY indexname;

