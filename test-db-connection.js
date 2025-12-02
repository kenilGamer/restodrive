// Test database connection
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  console.log('\n🔍 Testing database connection...\n')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing')
  
  if (process.env.DATABASE_URL) {
    // Mask password in output
    const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')
    console.log('Connection string:', maskedUrl)
  }
  
  try {
    console.log('\n📡 Attempting to connect...\n')
    
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    console.log('✅ SUCCESS! Database connection working!')
    console.log('Result:', result)
    
    // Try to query User table
    try {
      const userCount = await prisma.user.count()
      console.log(`\n✅ User table accessible. Current user count: ${userCount}`)
    } catch (err) {
      console.log('\n⚠️  User table not found or not accessible.')
      console.log('This is normal if migrations haven\'t been run yet.')
    }
    
  } catch (error) {
    console.error('\n❌ CONNECTION FAILED!\n')
    console.error('Error:', error.message)
    console.error('\nError Code:', error.code)
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n🔧 Troubleshooting steps:')
      console.log('1. Check if your Supabase database is paused (free tier pauses after inactivity)')
      console.log('   → Go to https://supabase.com/dashboard')
      console.log('   → Check your project status')
      console.log('   → If paused, click "Restore" to wake it up')
      console.log('\n2. Verify your DATABASE_URL format:')
      console.log('   Should include: ?sslmode=require')
      console.log('   Should use port: 6543 (pooler) or 5432 (direct)')
      console.log('\n3. Check your .env file:')
      console.log('   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"')
    }
    
    if (error.message.includes('SSL')) {
      console.log('\n🔒 SSL Error detected!')
      console.log('Make sure your DATABASE_URL includes: ?sslmode=require')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

