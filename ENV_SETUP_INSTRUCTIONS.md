# Environment Variables Setup

## Quick Setup

Run the setup script to create `.env.local` with Razorpay credentials:

```powershell
powershell -ExecutionPolicy Bypass -File setup-env.ps1
```

Or manually create `.env.local` with the following content:

## Required Environment Variables

### Database Connection
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@localhost:5432/restodrive?schema=public"
```

**For Supabase:**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

### Authentication (NextAuth)
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Razorpay Payment Gateway ✅
```env
RAZORPAY_KEY_ID="rzp_test_RmnJwxoxuIXWS1"
RAZORPAY_KEY_SECRET="5h60MBhRfJoJoJGRT3jlO5V4"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret-here"
```

## Complete .env.local Template

```env
# ============================================
# DATABASE (PostgreSQL/Supabase)
# ============================================
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@localhost:5432/restodrive?schema=public"

# ============================================
# AUTHENTICATION (NextAuth)
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here-generate-with-openssl-rand-base64-32"

# ============================================
# OAUTH PROVIDERS (Optional)
# ============================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ============================================
# RAZORPAY PAYMENT GATEWAY
# ============================================
RAZORPAY_KEY_ID="rzp_test_RmnJwxoxuIXWS1"
RAZORPAY_KEY_SECRET="5h60MBhRfJoJoJGRT3jlO5V4"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret-here"

# ============================================
# CLOUDINARY (Optional - for image uploads)
# ============================================
# CLOUDINARY_CLOUD_NAME="your-cloud-name"
# CLOUDINARY_API_KEY="your-api-key"
# CLOUDINARY_API_SECRET="your-api-secret"

# ============================================
# APP CONFIGURATION
# ============================================
APP_URL="http://localhost:3000"
```

## After Setup

1. **Update DATABASE_URL** with your actual database connection string
2. **Generate and set NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
3. **Restart your development server**:
   ```bash
   npm run dev
   ```

## Verification

Check that your environment variables are loaded:
- Razorpay payments should work in POS
- Database connection should work
- Authentication should work

## Security Notes

- ⚠️ Never commit `.env.local` to git (it's already in `.gitignore`)
- ⚠️ Never share your `RAZORPAY_KEY_SECRET` publicly
- ⚠️ Use different keys for development and production
- ⚠️ Rotate secrets regularly in production

## Troubleshooting

### Payment Gateway Not Working
- Check that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set correctly
- Verify the keys are from the same Razorpay account (test/live)
- Restart the dev server after updating `.env.local`

### Database Connection Issues
- Verify `DATABASE_URL` format is correct
- Check that database is running and accessible
- For Supabase: Ensure database is not paused

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set and not empty
- Check that `NEXTAUTH_URL` matches your app URL
- Restart dev server after changes

