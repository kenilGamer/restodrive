# Session Management Implementation

## Overview

Session management has been implemented to allow users to view and revoke active login sessions from different devices.

## Database Schema

A new `UserSession` model has been added to track active sessions with metadata:

- `id` - Unique session identifier
- `userId` - Reference to the user
- `sessionToken` - JWT token identifier or session token
- `device` - Device type (Windows, Mac, iPhone, etc.)
- `browser` - Browser name (Chrome, Firefox, Safari, etc.)
- `os` - Operating system
- `ipAddress` - IP address
- `location` - Location (city, country)
- `userAgent` - Full user agent string
- `isActive` - Whether the session is active
- `lastActive` - Last activity timestamp
- `createdAt` - Session creation timestamp

## Migration

Run the SQL migration to create the `user_sessions` table:

```sql
-- See prisma/migrations/add_user_sessions.sql
```

Or use Prisma:

```bash
npx prisma migrate dev --name add_user_sessions
npx prisma generate
```

## API Endpoints

### GET `/api/auth/sessions`
Get all active sessions for the current user.

**Response:**
```json
{
  "sessions": [
    {
      "id": "session-id",
      "device": "Windows",
      "browser": "Chrome",
      "os": "Windows 10",
      "ipAddress": "192.168.1.1",
      "location": "New York, US",
      "lastActive": "2024-01-01T12:00:00Z",
      "createdAt": "2024-01-01T10:00:00Z",
      "isCurrent": false
    }
  ]
}
```

### POST `/api/auth/sessions`
Create a new session (called on login).

**Request:**
```json
{
  "device": "Windows",
  "browser": "Chrome",
  "os": "Windows 10",
  "ipAddress": "192.168.1.1",
  "location": "New York, US",
  "userAgent": "Mozilla/5.0...",
  "sessionToken": "jwt-token-id"
}
```

### DELETE `/api/auth/sessions/[sessionId]`
Revoke a specific session.

**Response:**
```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

### PATCH `/api/auth/sessions/[sessionId]`
Update session last active time.

## Features

1. **View Active Sessions**
   - Lists all active sessions with device, browser, OS info
   - Shows IP address and location
   - Displays last active time (relative format)
   - Marks current session

2. **Revoke Sessions**
   - Users can revoke sessions from other devices
   - Confirmation dialog before revoking
   - Current session cannot be revoked (for safety)

3. **Session Tracking**
   - Sessions are tracked with metadata
   - Last active time is updated
   - Inactive sessions can be marked as inactive

## Integration with Login

To fully track sessions, you should create a `UserSession` record when users log in. You can do this by:

1. **Updating the login API** to create a session record after successful authentication
2. **Extracting device/browser info** from the request headers
3. **Using a geolocation service** (optional) to get location from IP

Example integration in login handler:

```typescript
// After successful login
const userAgent = req.headers['user-agent'] || ''
const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress

// Parse user agent to get device/browser/OS
const deviceInfo = parseUserAgent(userAgent)

await db.userSession.create({
  data: {
    userId: user.id,
    sessionToken: sessionToken,
    device: deviceInfo.device,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    ipAddress: ipAddress,
    location: await getLocationFromIP(ipAddress), // Optional
    userAgent: userAgent,
  },
})
```

## Future Enhancements

- Automatic session cleanup (remove expired sessions)
- Session activity tracking (update lastActive on each request)
- Geolocation service integration
- Email notifications for new sessions
- Session limits (max concurrent sessions)

## Security Notes

- Sessions are user-scoped (users can only see/revoke their own sessions)
- Current session cannot be revoked (prevents accidental lockout)
- Session tokens should be stored securely
- Consider implementing session blacklist for JWT revocation

