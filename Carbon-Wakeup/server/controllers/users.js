import pool from '../db.js';

// Create user
export const createUser = async (req, res) => {
  try {
    const { userId, userType, email } = req.body;
    const result = await pool.query(
      `INSERT INTO users.user_accounts 
       (user_id, type, registration_date, email) 
       VALUES ($1, $2, CURRENT_DATE, $3) 
       RETURNING *`,
      [userId, userType, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set password
export const setPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    await pool.query(
      'INSERT INTO users.passwords (user_id, password_hash) VALUES ($1, $2)',
      [userId, password]
    );
    res.status(201).json({ message: 'Password set successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify sign in
export const verifySignIn = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const result = await pool.query(
      `SELECT u.user_id, u.email, u.type 
       FROM users.user_accounts u
       JOIN users.passwords p ON u.user_id = p.user_id
       WHERE u.user_id = $1 AND p.password_hash = $2`,
      [userId, password]
    );
    
    if (result.rows.length > 0) {
      res.json({ authenticated: true, user: result.rows[0] });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query('DELETE FROM users.user_accounts WHERE user_id = $1', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};