# Two-Factor Authentication Migration Instructions

## Quick Fix: Run SQL Migration

The Prisma client needs to be regenerated and the database needs the new columns. Here are the steps:

### Option 1: Run SQL in Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL:

```sql
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT,
ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false;
```

4. Verify it worked:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('twoFactorSecret', 'twoFactorEnabled');
```

### Option 2: Using Prisma Studio (If database is accessible)

1. Stop your dev server (Ctrl+C)
2. Run: `npx prisma db push`
3. Run: `npx prisma generate`
4. Restart dev server: `npm run dev`

### Option 3: Using Supabase CLI (After fixing env file)

1. Fix the `.env.local` file encoding issue (remove BOM characters)
2. Run: `npx supabase db push --linked`

### Option 4: Direct psql Connection

If you have direct database access:

```bash
psql "your-database-connection-string" -f prisma/migrations/add_two_factor_auth.sql
```

## After Migration

Once the database columns are added:

1. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Restart your dev server:**
   ```bash
   npm run dev
   ```

The 2FA feature should now work correctly!

## Verify Migration

Check that the columns exist:
- `twoFactorSecret` (TEXT, nullable)
- `twoFactorEnabled` (BOOLEAN, default: false)

