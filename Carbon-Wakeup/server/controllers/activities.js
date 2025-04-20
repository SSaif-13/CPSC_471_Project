import pool from '../db.js';

// Record donation
export const recordDonation = async (req, res) => {
  try {
    const { userId, amount, organization } = req.body;
    const result = await pool.query(
      `INSERT INTO users.donations 
       (user_id, amount, donation_date, organization) 
       VALUES ($1, $2, CURRENT_DATE, $3) 
       RETURNING *`,
      [userId, amount, organization]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get donation history
export const getDonationHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT * FROM users.donations 
       WHERE user_id = $1 
       ORDER BY donation_date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record carbon footprint
export const recordFootprint = async (req, res) => {
  try {
    const { userId, footprint } = req.body;
    const result = await pool.query(
      `INSERT INTO users.carbon_footprints 
       (user_id, footprint) 
       VALUES ($1, $2) 
       RETURNING *`,
      [userId, parseFloat(footprint)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get carbon footprint
export const getFootprint = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT * FROM users.carbon_footprints 
       WHERE user_id = $1 
       ORDER BY measurement_date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};