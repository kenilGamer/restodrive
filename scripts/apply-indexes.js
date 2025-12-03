/**
 * Apply database indexes directly via SQL
 * This script connects directly to the database and applies the indexes
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function applyIndexes() {
  try {
    console.log('🔍 Checking existing indexes...\n')

    // Check if indexes already exist
    const existingIndexes = await prisma.$queryRaw`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'orders' 
        AND (indexname LIKE '%restaurantId%createdAt%')
      ORDER BY indexname
    `

    console.log('Existing indexes:')
    if (existingIndexes.length > 0) {
      existingIndexes.forEach(idx => {
        console.log(`  ✓ ${idx.indexname}`)
      })
    } else {
      console.log('  (none found)')
    }

    console.log('\n📊 Applying indexes...\n')

    // Apply first index
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "orders_restaurantId_createdAt_idx" 
      ON "orders" ("restaurantId", "createdAt")
    `
    console.log('✅ Created index: orders_restaurantId_createdAt_idx')

    // Apply second index
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "orders_restaurantId_createdAt_paymentStatus_idx" 
      ON "orders" ("restaurantId", "createdAt", "paymentStatus")
    `
    console.log('✅ Created index: orders_restaurantId_createdAt_paymentStatus_idx')

    console.log('\n🔍 Verifying indexes...\n')

    // Verify indexes were created
    const newIndexes = await prisma.$queryRaw`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'orders' 
        AND (indexname LIKE '%restaurantId%createdAt%')
      ORDER BY indexname
    `

    console.log('Final indexes:')
    newIndexes.forEach(idx => {
      console.log(`  ✓ ${idx.indexname}`)
    })

    console.log('\n✨ Indexes applied successfully!\n')
    console.log('Performance benefits:')
    console.log('  • Faster queries filtering by restaurantId + createdAt')
    console.log('  • Faster revenue calculations with paymentStatus')
    console.log('  • Expected 5-10x speedup for dashboard queries\n')

  } catch (error) {
    console.error('❌ Error applying indexes:', error.message)
    
    if (error.code === 'P1001') {
      console.error('\n💡 Database connection failed.')
      console.error('   The database might be paused (Supabase free tier).')
      console.error('   Please:')
      console.error('   1. Go to Supabase Dashboard')
      console.error('   2. Restore your database if paused')
      console.error('   3. Or run the SQL manually in Supabase SQL Editor')
      console.error('\n   SQL file: migrations/add-dashboard-indexes.sql\n')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

applyIndexes()

