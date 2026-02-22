// Test with simpler username
import pg from 'pg';
const { Client } = pg;

const connectionConfig = {
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres',  // Try without project ID
  password: '7TyAq8x45JJHPkob',
  ssl: { rejectUnauthorized: false }
};

async function testConnection() {
  const client = new Client(connectionConfig);
  
  try {
    console.log('🔄 Connecting (user: postgres)...');
    await client.connect();
    console.log('✅ Connected!');
    
    const result = await client.query('SELECT version()');
    console.log('✅ PostgreSQL version:', result.rows[0].version);
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();
