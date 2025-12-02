# Restaurant Digital Suite - Complete Troubleshooting Guide

This guide consolidates all troubleshooting information for common issues encountered during setup and development.

---

## Table of Contents

1. [Database Connection Issues](#database-connection-issues)
2. [NextAuth Configuration](#nextauth-configuration)
3. [Redirect Loop Issues](#redirect-loop-issues)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Quick Reference](#quick-reference)

---

## Database Connection Issues

### Common Error
```
Can't reach database server at `db.ddwmgwqwilpfdhjkdscw.supabase.co:6543`
Error: P1001: Can't reach database server
```

### Most Likely Causes (in order)

#### 1. Database is Paused (90% probability) ⭐ MOST COMMON

**Free tier Supabase databases pause after 7 days of inactivity.**

**Solution:**
1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Find your project (`ddwmgwqwilpfdhjkdscw`)
4. Check the project status:
   - If you see "Paused" or "Inactive" → Click **"Restore"** or **"Resume"**
   - Wait 1-2 minutes for the database to fully start
5. After restoring, restart your dev server:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

#### 2. Missing SSL Parameter

**Supabase requires SSL connections.**

**Wrong:**
```env
DATABASE_URL="postgresql://postgres:password@db.ddwmgwqwilpfdhjkdscw.supabase.co:5432/postgres"
```

**Correct:**
```env
DATABASE_URL="postgresql://postgres:password@db.ddwmgwqwilpfdhjkdscw.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

#### 3. Wrong Port Number

**Current:** Using port `5432` (direct connection)  
**Try:** Port `6543` (connection pooler - recommended)

**Port Options:**
- `6543` = Connection pooler (recommended, more reliable)
- `5432` = Direct connection (can be blocked/firewalled)

#### 4. Password Encoding Issues

**Special characters in passwords must be URL-encoded:**

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

**Example:**
- Password: `creativitycoder@2025`
- Encoded: `creativitycoder%402025`

#### 5. Incorrect Password

**Verify your password:**
1. Go to Supabase Dashboard → Project Settings → Database
2. Check the database password
3. Make sure it matches what's in your `.env` file
4. Remember: `@` in password must be encoded as `%40`

#### 6. Network/Firewall Issues

**Check:**
- Is your internet connection working?
- Are you behind a corporate firewall?
- Try accessing Supabase dashboard in browser

#### 7. IP Restrictions

**If enabled:**
1. Go to Supabase Dashboard → Project Settings → Database
2. Check "Connection Pooling" → "Allowed IPs"
3. Make sure your IP is whitelisted OR use "Allow all IPs" for development

### Connection String Formats

#### Option A: Connection Pooler (Recommended)
```env
DATABASE_URL="postgresql://postgres:creativitycoder%402025@db.ddwmgwqwilpfdhjkdscw.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

#### Option B: Direct Connection
```env
DATABASE_URL="postgresql://postgres:creativitycoder%402025@db.ddwmgwqwilpfdhjkdscw.supabase.co:5432/postgres?sslmode=require"
```

### Step-by-Step Fix Process

#### Step 1: Check Database Status
- [ ] Go to Supabase dashboard
- [ ] Verify project is active (not paused)
- [ ] If paused, click "Restore"

#### Step 2: Verify Connection String
- [ ] Open `.env` file
- [ ] Check `DATABASE_URL` format
- [ ] Ensure password has `%40` instead of `@`
- [ ] Ensure `?sslmode=require` is present

#### Step 3: Get Fresh Connection String from Supabase
1. Go to Supabase Dashboard → Settings → Database
2. Scroll to "Connection string"
3. Select "Connection pooling" tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password (URL-encoded)

### Testing Commands

```bash
# Test connection
node test-db-connection.js

# Test with Prisma
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Expected Success Output

When connection works, you should see:
```
✅ SUCCESS! Database connection working!
Result: [ { test: 1 } ]
✅ User table accessible. Current user count: X
```

### Still Not Working?

1. **Double-check Supabase dashboard:**
   - Project is active (not paused)
   - Database password is correct
   - No IP restrictions blocking you

2. **Try fresh connection string:**
   - Get it directly from Supabase dashboard
   - Copy exactly as shown
   - Replace password with URL-encoded version

3. **Check Supabase status page:**
   - https://status.supabase.com/
   - See if there are any outages

4. **Contact Supabase support:**
   - If everything else fails, there might be an account issue

---

## NextAuth Configuration

### Issue
NextAuth.js requires two environment variables:
- `NEXTAUTH_SECRET` - A secret key for encrypting JWT tokens
- `NEXTAUTH_URL` - The canonical URL of your site

### Error Messages
```
[next-auth][warn][NO_SECRET]
[next-auth][warn][NEXTAUTH_URL]
[next-auth][error][NO_SECRET]
```

### Solution

Add these lines to your `.env` file:

```env
NEXTAUTH_SECRET=v49aHsXn7kAdXuTnWYIXIA0xtedYrrb7Y37xNb9tRVk=
NEXTAUTH_URL=http://localhost:3000
```

### For Production
When deploying, update `NEXTAUTH_URL` to your production domain:
```env
NEXTAUTH_URL=https://yourdomain.com
```

### Generate a New Secret (Optional)
If you want to generate a new secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Or using OpenSSL:
```bash
openssl rand -base64 32
```

### After Adding Variables

1. **Restart your development server** (stop `npm run dev` and start it again)
2. The NextAuth warnings should disappear
3. Authentication should work properly

### Verification

After restarting, you should see:
- ✅ No `[next-auth][warn][NO_SECRET]` warnings
- ✅ No `[next-auth][warn][NEXTAUTH_URL]` warnings
- ✅ Login/register pages working correctly

---

## Redirect Loop Issues

### Issue
The application was experiencing an infinite redirect loop where `callbackUrl` parameters were being nested infinitely, causing the browser to redirect repeatedly.

### Root Cause
The issue was caused by conflicts between:
1. NextAuth's `withAuth` middleware automatically handling redirects
2. Manual redirect logic in the middleware function
3. NextAuth's default redirect mechanism trying to redirect to `/api/auth/signin`

### Solution

#### 1. Simplified Middleware (`middleware.ts`)
- Removed manual redirect logic for unauthenticated users accessing dashboard
- Let NextAuth's `withAuth` handle the redirect automatically
- Only manually redirect authenticated users away from auth pages
- Added `pages.signIn` configuration to tell NextAuth where the login page is

#### 2. Updated Login Page (`app/auth/login/page.tsx`)
- Added `useSession` hook to check if user is already authenticated
- Added `useSearchParams` to read `callbackUrl` from URL
- Redirect authenticated users immediately if they visit the login page
- Use `callbackUrl` from search params when redirecting after login

### Testing

After these changes:
1. ✅ Unauthenticated users accessing `/dashboard` are redirected to `/auth/login` without nested callbackUrls
2. ✅ Authenticated users accessing `/auth/login` are redirected to `/dashboard`
3. ✅ After successful login, users are redirected to their original destination (if callbackUrl was provided)
4. ✅ No more infinite redirect loops

### Key Changes

**Before:**
- Middleware was manually redirecting unauthenticated users
- This conflicted with NextAuth's built-in redirect handling
- Created nested callbackUrl parameters

**After:**
- Middleware only handles authenticated users on auth pages
- NextAuth handles unauthenticated user redirects automatically
- Login page properly handles callbackUrl without nesting

---

## Environment Variables Setup

### Required Environment Variables

#### Database Connection (Supabase)
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ddwmgwqwilpfdhjkdscw.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

**Key Requirements:**
- ✅ Must include `?sslmode=require` (Supabase requires SSL)
- ✅ Use port `6543` for connection pooler (recommended)
- ✅ Or use port `5432` for direct connection
- ✅ Must be wrapped in quotes `"..."`
- ✅ URL-encode special characters in password (`@` → `%40`)

#### NextAuth Configuration
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Complete .env Template

```env
# ============================================
# DATABASE (Supabase)
# ============================================
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.ddwmgwqwilpfdhjkdscw.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"

# ============================================
# AUTHENTICATION (NextAuth)
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[generate-with-openssl-rand-base64-32]"

# ============================================
# OAUTH PROVIDERS (Optional)
# ============================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ============================================
# APP CONFIGURATION
# ============================================
APP_URL="http://localhost:3000"

# ============================================
# PAYMENT GATEWAYS (Optional)
# ============================================
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# ============================================
# FILE STORAGE (Optional)
# ============================================
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Common Issues

#### Issue 1: DATABASE_URL Missing SSL
**Wrong:**
```env
DATABASE_URL="postgresql://postgres:password@db.ddwmgwqwilpfdhjkdscw.supabase.co:5432/postgres"
```

**Correct:**
```env
DATABASE_URL="postgresql://postgres:password@db.ddwmgwqwilpfdhjkdscw.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

#### Issue 2: NEXTAUTH_SECRET Missing or Weak
**Wrong:**
```env
NEXTAUTH_SECRET="secret"
```

**Correct (generate a strong secret):**
```bash
# Generate a secure secret:
openssl rand -base64 32
```

Then use:
```env
NEXTAUTH_SECRET="[generated-secret-from-openssl]"
```

#### Issue 3: Password Special Characters Not Encoded
**Wrong:**
```env
DATABASE_URL="postgresql://postgres:creativitycoder@2025@db..."
```

**Correct:**
```env
DATABASE_URL="postgresql://postgres:creativitycoder%402025@db..."
```

### Quick Fixes

#### Fix DATABASE_URL
1. Get connection string from Supabase Dashboard
2. Make sure it includes `?sslmode=require`
3. Use port `6543` (pooler) instead of `5432`
4. Replace `[PASSWORD]` with your actual database password (URL-encoded)

#### Fix NEXTAUTH_SECRET
1. Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```
2. Copy the output
3. Paste it as the value for `NEXTAUTH_SECRET`

### Verification

After updating, test your connection:
```bash
npx prisma db pull
```

If successful, run migrations:
```bash
npx prisma migrate dev
```

---

## Quick Reference

### Connection String Format
```
postgresql://postgres:[ENCODED-PASSWORD]@db.[PROJECT-REF].supabase.co:[PORT]/postgres?[PARAMS]
```

### Password Encoding
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

### Ports
- `6543` = Connection pooler (recommended)
- `5432` = Direct connection

### Common Commands

```bash
# Test database connection
node test-db-connection.js

# Test with Prisma
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Generate NextAuth secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Useful Links

- Supabase Dashboard: https://supabase.com/dashboard
- Supabase Status: https://status.supabase.com/
- Supabase Docs: https://supabase.com/docs/guides/database/connecting-to-postgres
- Prisma + Supabase: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-supabase

---

## Summary

### Most Common Issues

1. **Database Paused** (90% of connection failures)
   - Solution: Restore database in Supabase dashboard

2. **Missing SSL Parameter**
   - Solution: Add `?sslmode=require` to DATABASE_URL

3. **Password Not URL-Encoded**
   - Solution: Encode special characters (`@` → `%40`)

4. **Missing NEXTAUTH_SECRET**
   - Solution: Generate and add to `.env` file

5. **Redirect Loop**
   - Solution: Simplified middleware, let NextAuth handle redirects

### Quick Checklist

- [ ] Database is active (not paused) in Supabase dashboard
- [ ] DATABASE_URL includes `?sslmode=require`
- [ ] Password is URL-encoded (special characters)
- [ ] Using correct port (6543 for pooler, 5432 for direct)
- [ ] NEXTAUTH_SECRET is set in `.env`
- [ ] NEXTAUTH_URL is set in `.env`
- [ ] Development server restarted after `.env` changes

---

*Last updated: 2025*

