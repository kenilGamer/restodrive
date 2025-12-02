#!/usr/bin/env node

/**
 * Fix Connection Pool Limit Script
 * Updates DATABASE_URL to increase connection_limit from 1 to 10
 */

const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env')

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!')
  process.exit(1)
}

let envContent = fs.readFileSync(envPath, 'utf8')

// Check if DATABASE_URL exists
if (!envContent.includes('DATABASE_URL=')) {
  console.error('❌ DATABASE_URL not found in .env file!')
  process.exit(1)
}

// Check current connection_limit
const connectionLimitMatch = envContent.match(/connection_limit=(\d+)/)
const currentLimit = connectionLimitMatch ? parseInt(connectionLimitMatch[1]) : null

if (currentLimit === 1) {
  console.log('🔧 Found connection_limit=1, updating to connection_limit=10...')
  
  // Replace connection_limit=1 with connection_limit=10
  envContent = envContent.replace(/connection_limit=1/g, 'connection_limit=10')
  
  // Write back to file
  fs.writeFileSync(envPath, envContent, 'utf8')
  
  console.log('✅ Updated DATABASE_URL connection_limit from 1 to 10')
  console.log('')
  console.log('⚠️  IMPORTANT: Restart your dev server for changes to take effect!')
  console.log('   Run: npm run dev (or your dev command)')
} else if (currentLimit && currentLimit > 1) {
  console.log(`✅ Connection limit is already set to ${currentLimit}`)
  console.log('   No changes needed.')
} else {
  console.log('⚠️  Could not find connection_limit parameter in DATABASE_URL')
  console.log('')
  console.log('📝 Manual fix required:')
  console.log('   1. Open your .env file')
  console.log('   2. Find DATABASE_URL')
  console.log('   3. Add or update: &connection_limit=10&')
  console.log('')
  console.log('   Example:')
  console.log('   DATABASE_URL="...&connection_limit=10&sslmode=require"')
}

