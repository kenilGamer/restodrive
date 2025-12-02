# Two-Factor Authentication (2FA) Setup Guide

## Overview

Two-factor authentication has been implemented using TOTP (Time-based One-Time Password) standard. Users can enable 2FA using authenticator apps like Google Authenticator, Authy, or Microsoft Authenticator.

## Database Migration

Before using 2FA, you need to run a database migration to add the new fields to the User model:

```bash
npx prisma migrate dev --name add_two_factor_auth
```

Or if you prefer to create the migration manually:

```sql
ALTER TABLE "users" ADD COLUMN "twoFactorSecret" TEXT;
ALTER TABLE "users" ADD COLUMN "twoFactorEnabled" BOOLEAN DEFAULT false;
```

Then regenerate Prisma client:

```bash
npx prisma generate
```

## Features

### 1. Setup 2FA
- Users can click "Set Up 2FA" button
- System generates a TOTP secret
- QR code is displayed for easy scanning
- Manual entry key is also provided
- User scans QR code with authenticator app

### 2. Verify and Enable
- User enters 6-digit code from authenticator app
- System verifies the code
- 2FA is enabled if verification succeeds

### 3. Disable 2FA
- Requires current password
- Requires current 2FA verification code
- Both must be valid to disable

## API Endpoints

### GET `/api/auth/two-factor/setup`
Generates a new 2FA secret and QR code for setup.

**Response:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,...",
  "manualEntryKey": "JBSWY3DPEHPK3PXP"
}
```

### POST `/api/auth/two-factor/verify`
Verifies a 2FA token and enables 2FA.

**Request:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA has been enabled successfully"
}
```

### POST `/api/auth/two-factor/disable`
Disables 2FA (requires password and current token).

**Request:**
```json
{
  "password": "user-password",
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA has been disabled successfully"
}
```

### GET `/api/auth/two-factor/status`
Gets the current 2FA status for the user.

**Response:**
```json
{
  "enabled": true
}
```

## Integration with Login

To require 2FA during login, you'll need to update the authentication flow in `lib/auth.ts`:

1. After password verification, check if user has 2FA enabled
2. If enabled, require a 2FA token
3. Verify the token before allowing login

Example implementation:

```typescript
// In lib/auth.ts authorize function
if (user.twoFactorEnabled) {
  // Check if 2FA token is provided
  if (!credentials?.twoFactorToken) {
    throw new Error("2FA token required")
  }
  
  // Verify 2FA token
  const isValid = authenticator.verify({
    token: credentials.twoFactorToken,
    secret: user.twoFactorSecret!,
  })
  
  if (!isValid) {
    throw new Error("Invalid 2FA token")
  }
}
```

## Security Notes

- 2FA secrets are stored in the database (should be encrypted in production)
- TOTP tokens are time-based and expire after 30 seconds
- Users must verify setup before 2FA is enabled
- Disabling 2FA requires both password and current token for security

## Testing

1. Enable 2FA in settings
2. Scan QR code with authenticator app
3. Enter verification code
4. Verify 2FA is enabled
5. Test disabling 2FA (requires password + token)

## Dependencies

- `otplib` - TOTP generation and verification
- `qrcode` - QR code generation for easy setup

