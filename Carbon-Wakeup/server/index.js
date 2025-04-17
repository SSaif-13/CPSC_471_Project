import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Log environment variables
console.log('Environment Variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});

// Azure PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // Connect to default DB
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
    search_path: 'emissions,users,public' // Set schema search path
  });

// Test database connection on startup
async function testDatabaseConnection() {
  let client;
  try {
    console.log('\n=== Testing Database Connection ===');
    client = await pool.connect();
    
    // Test simple query
    const timeResult = await client.query('SELECT NOW()');
    console.log('Basic query successful. Current time:', timeResult.rows[0].now);
    
    // List available databases
    const dbResult = await client.query(`
      SELECT datname FROM pg_database 
      WHERE datistemplate = false
      AND datname NOT IN ('azure_sys', 'azure_maintenance')
      ORDER BY datname
    `);
    console.log('Available databases:', dbResult.rows.map(r => r.datname));
    
    // Test current database
    const currentDbResult = await client.query('SELECT current_database()');
    console.log('Connected to database:', currentDbResult.rows[0].current_database);
    
    // Test user privileges
    const userResult = await client.query('SELECT current_user');
    console.log('Connected as user:', userResult.rows[0].current_user);
    
  } catch (err) {
    console.error('Database connection failed:', err.message);
    console.error('Full error details:', err);
  } finally {
    if (client) client.release();
  }
}

// API endpoint for manual testing
app.get('/api/test', async (req, res) => {
  console.log('\n=== /api/test endpoint called ===');
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    res.json({
      status: 'success',
      time: result.rows[0].now,
      database: process.env.DB_NAME,
      message: 'Database connection successful'
    });
  } catch (err) {
    console.error('Endpoint error:', err);
    res.status(500).json({
      status: 'error',
      error: err.message,
      details: {
        config: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_NAME
        }
      }
    });
  } finally {
    if (client) client.release();
  }
});

// Start server after testing connection
testDatabaseConnection().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}`);
    console.log(` Test endpoint available at http://localhost:${PORT}/api/test`);
  });
});