import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import router from './routes/index.js';

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
  database: process.env.DB_NAME, // Connect to default DB
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

// Mount the router under /api prefix
app.use('/api', router);

// Calculate API call
app.post('/api/calculate', (req, res) => {
  try {
    const electricityUsageKWh = parseFloat(req.body.electricityUsageKWh) || 0;
    const kmDrivenPerMonth = parseFloat(req.body.kmDrivenPerMonth) || 0;
    const naturalGasGJPerMonth = parseFloat(req.body.naturalGasGJPerMonth) || 0;
    const caloriesPerDay = parseFloat(req.body.caloriesPerDay) || 0;
    const dietaryChoice = req.body.dietaryChoice || "Vegan";

    // emission factors
    const electricityFactor = 0.49;     // kg CO2e per kWh
    const transportationFactor = 0.143;    // kg CO2e per km
    const naturalGasFactor = 50;       // kg CO2e per GJ
    const kgCO2ePerYearFactor = 12;       // convert monthly to yearly
    const daysPerYear = 365;

    // dietary emissions per 1000 calories (kg CO2e)
    const dietaryFactors = {
      Vegan: 0.69,
      Vegetarian: 1.16,
      Pescatarian: 1.66,
      Omnivore: 2.23
    };

    // emissions calculations
    const electricityEmissions = electricityUsageKWh * electricityFactor;
    const transportationEmissions = kmDrivenPerMonth * transportationFactor;
    const naturalGasEmissions = naturalGasGJPerMonth * naturalGasFactor;

    const yearlyElectricityEmissions = electricityEmissions * kgCO2ePerYearFactor;
    const yearlyTransportationEmissions = transportationEmissions * kgCO2ePerYearFactor;
    const yearlyNaturalGasEmissions = naturalGasEmissions * kgCO2ePerYearFactor;

    // dietary emissions based on kcal/day and type
    const dietFactor = dietaryFactors[dietaryChoice] || 0;
    const dietaryChoiceEmissions = (dietFactor * (caloriesPerDay / 1000)) * daysPerYear;

    const totalYearlyEmissions =
      yearlyElectricityEmissions +
      yearlyTransportationEmissions +
      yearlyNaturalGasEmissions +
      dietaryChoiceEmissions;

    res.json({
      yearlyElectricityEmissions: { value: yearlyElectricityEmissions, unit: 'kgCO2e/year' },
      yearlyTransportationEmissions: { value: yearlyTransportationEmissions, unit: 'kgCO2e/year' },
      yearlyNaturalGasEmissions: { value: yearlyNaturalGasEmissions, unit: 'kgCO2e/year' },
      dietaryChoiceEmissions: { value: dietaryChoiceEmissions, unit: 'kgCO2e/year' },
      totalYearlyEmissions: { value: totalYearlyEmissions, unit: 'kgCO2e/year' }
    });
  } catch (err) {
    console.error('Error in /api/calculate:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// date
const DATE_FORMAT = 'DD Mon YYYY';

// fetch all users data
app.get('/api/users', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT
        ua.user_id              AS id,
        ua.name,
        to_char(ua.registration_date, '${DATE_FORMAT}') AS joined,
        COALESCE(to_char(SUM(d.amount), '$FM999,999.00'), '$0.00') AS donated
      FROM users.user_accounts ua
      LEFT JOIN users.donations d ON ua.user_id = d.user_id
      GROUP BY ua.user_id, ua.name, ua.registration_date
      ORDER BY ua.registration_date DESC;
    `;
    const { rows } = await client.query(query);
    res.json({ status: 'success', users: rows });
  } catch (err) {
    console.error('GET /api/users error', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client && client.release();
  }
});



// Start server after testing connection
testDatabaseConnection().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}`);
    console.log(`Test endpoint available at http://localhost:${PORT}/api/test`);
    console.log(`API routes available under http://localhost:${PORT}/api`);
  });
});