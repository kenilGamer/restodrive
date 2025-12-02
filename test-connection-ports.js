// Test both connection ports
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function testPort(port, description) {
  console.log(`\n🔍 Testing ${description} (port ${port})...`)
  
  const url = process.env.DATABASE_URL.replace(/:6543|:5432/, `:${port}`)
  
  const prisma = new PrismaClient({
    datasources: {
      db: { url }
    },
    log: ['error']
  })
  
  try {
    await prisma.$queryRaw`SELECT 1 as test`
    console.log(`✅ SUCCESS with port ${port}!`)
    return true
  } catch (error) {
    console.log(`❌ FAILED with port ${port}: ${error.message.split('\n')[0]}`)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

async function testBothPorts() {
  console.log('📡 Testing database connection on both ports...\n')
  
  const port6543 = await testPort(6543, 'Connection Pooler')
  const port5432 = await testPort(5432, 'Direct Connection')
  
  console.log('\n' + '='.repeat(50))
  if (port6543 || port5432) {
    console.log('✅ At least one port is working!')
    if (port6543) {
      console.log('💡 Recommendation: Use port 6543 (Connection Pooler)')
    } else if (port5432) {
      console.log('💡 Recommendation: Use port 5432 (Direct Connection)')
      console.log('⚠️  Note: You may need to update your .env file to use port 5432')
    }
  } else {
    console.log('❌ Both ports failed. Most likely causes:')
    console.log('   1. Database is paused - Restore it in Supabase dashboard')
    console.log('   2. Wrong password - Check your .env file')
    console.log('   3. Network/firewall issue - Check your internet connection')
  }
  console.log('='.repeat(50))
}

testBothPorts().catch(console.error)

