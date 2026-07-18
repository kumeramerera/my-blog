// test-connection.ts
import { db } from './db';
import { users } from './db/schema';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Try to insert a test user
    const result = await db.insert(users).values({
      email: 'test@example.com',
      name: 'Test User',
    }).returning();
    
    console.log('✅ Database is working!');
    console.log('📝 Inserted user:', result);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testConnection();