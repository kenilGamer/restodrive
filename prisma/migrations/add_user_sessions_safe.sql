-- Migration: Add UserSession model for session management (Safe Version)
-- This version checks for existing constraints before creating them

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS "user_sessions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "sessionToken" TEXT,
  "device" TEXT,
  "browser" TEXT,
  "os" TEXT,
  "ipAddress" TEXT,
  "location" TEXT,
  "userAgent" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_sessions_pkey'
  ) THEN
    ALTER TABLE "user_sessions" 
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "user_sessions_userId_idx" ON "user_sessions"("userId");
CREATE INDEX IF NOT EXISTS "user_sessions_sessionToken_idx" ON "user_sessions"("sessionToken");

-- Add foreign key constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_sessions_userId_fkey'
  ) THEN
    ALTER TABLE "user_sessions" 
    ADD CONSTRAINT "user_sessions_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_sessions'
ORDER BY ordinal_position;

