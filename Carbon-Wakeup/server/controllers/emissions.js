import pool from '../db.js';

// Get all emissions data
export const getAllEmissions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emissions.emissions_data');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get emissions by year
export const getEmissionsByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const result = await pool.query(
      'SELECT * FROM emissions.emissions_data WHERE year = $1',
      [year]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get emissions by country
export const getEmissionsByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const result = await pool.query(
      'SELECT * FROM emissions.emissions_data WHERE country = $1',
      [country]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Compare multiple years
export const compareYears = async (req, res) => {
  try {
    const { years } = req.query; // Expect comma-separated years
    const yearList = years.split(',');
    const result = await pool.query(
      'SELECT * FROM emissions.emissions_data WHERE year = ANY($1)',
      [yearList]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Compare multiple countries
export const compareCountries = async (req, res) => {
  try {
    const { countries } = req.query; // Expect comma-separated countries
    const countryList = countries.split(',');
    const result = await pool.query(
      'SELECT * FROM emissions.emissions_data WHERE country = ANY($1)',
      [countryList]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by country and year
export const getByCountryAndYear = async (req, res) => {
  try {
    const { country, year } = req.params;
    const result = await pool.query(
      'SELECT * FROM emissions.emissions_data WHERE country = $1 AND year = $2',
      [country, year]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// updating emission value for specific country/year
export const updateEmission = async (req, res) => {
  const { country, year } = req.params;
  const { annual_co2_emissions } = req.body;  
  try {
    const result = await pool.query(
      `UPDATE emissions.emissions_data 
       SET annual_co2_emissions = $1 
       WHERE country = $2 AND year = $3 
       RETURNING *`,
      [annual_co2_emissions, country, year]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Emission record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};