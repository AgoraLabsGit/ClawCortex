// Quick Supabase connection test
const DATABASE_URL = 'postgresql://postgres.tknirrjluvyraqqdycci:7TyAq8x45JJHPkob@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';

async function testConnection() {
  const { Client } = require('pg');
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Connected to Supabase');
    
    // Create test table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clawcortex_test (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Test table created');
    
    // Insert test data
    const result = await client.query(
      'INSERT INTO clawcortex_test (message) VALUES ($1) RETURNING *',
      ['Henry successfully connected to Supabase! 🎉']
    );
    console.log('✅ Test data inserted:', result.rows[0]);
    
    // Query test data
    const query = await client.query('SELECT * FROM clawcortex_test ORDER BY created_at DESC LIMIT 5');
    console.log('✅ Test data retrieved:', query.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();
