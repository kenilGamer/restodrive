# Connection Pool Fix Guide

## Problem
You're experiencing connection pool timeouts:
```
Timed out fetching a new connection from the connection pool
Current connection pool timeout: 10, connection limit: 1
```

## Root Cause
Your `DATABASE_URL` has `connection_limit=1`, which only allows **one database connection at a time**. When multiple queries run in parallel (like `Promise.all()`), they queue up and timeout.

## Solution

### Option 1: Use the Fix Script (Recommended)
```bash
node scripts/fix-connection-pool.js
```

Then restart your dev server.

### Option 2: Manual Fix

1. **Open your `.env` file**

2. **Find your `DATABASE_URL` line**

3. **Change `connection_limit=1` to `connection_limit=10`**

   **Before:**
   ```
   DATABASE_URL="postgresql://...&connection_limit=1&sslmode=require"
   ```

   **After:**
   ```
   DATABASE_URL="postgresql://...&connection_limit=10&sslmode=require"
   ```

4. **Save the file**

5. **Restart your dev server** (stop and start `npm run dev`)

## Why This Works

- **Before**: Only 1 connection = queries queue up = timeouts
- **After**: 10 connections = parallel queries work = no timeouts

## Recommended Values

- **Development**: `connection_limit=10` (safe for local dev)
- **Production**: `connection_limit=20-50` (depends on your Supabase plan)

## Supabase Limits

- **Free Tier**: Up to 60 connections
- **Pro Tier**: Up to 200 connections
- **Team/Enterprise**: Custom limits

## Verify It's Fixed

After updating and restarting, you should see:
- ✅ No more "connection pool timeout" errors
- ✅ Faster query execution
- ✅ Parallel queries work correctly

## Still Having Issues?

1. Make sure you **restarted your dev server** after changing `.env`
2. Check that the change was saved correctly
3. Verify your Supabase database is not paused (free tier pauses after inactivity)
4. Try increasing to `connection_limit=20` if 10 isn't enough

