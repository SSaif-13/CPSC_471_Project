import pool from '../db.js';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

// Create user
export const createUser = async (req, res) => {
    try {
      const { userId, userType, email, password, name } = req.body;
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Start transaction
      await pool.query('BEGIN');
      
      // Create user account
      const userResult = await pool.query(
        `INSERT INTO users.user_accounts 
         (user_id, user_type, registration_date, email, name) 
         VALUES ($1, $2, CURRENT_DATE, $3, $4) 
         RETURNING *`,
        [userId, userType, email, name]
      );
      
      // Set password
      await pool.query(
        'INSERT INTO users.passwords (user_id, password_hash) VALUES ($1, $2)',
        [userId, hashedPassword]
      );
      
      // Commit transaction
      await pool.query('COMMIT');
      
      res.status(201).json(userResult.rows[0]);
    } catch (err) {
      await pool.query('ROLLBACK');
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
      const { email, password } = req.body;
      
      // First get user by email
      const userResult = await pool.query(
        'SELECT user_id, email, user_type FROM users.user_accounts WHERE email = $1',
        [email]
      );
      
      if (userResult.rows.length === 0) {
        return res.status(401).json({ authenticated: false, error: 'User not found' });
      }
      
      const user = userResult.rows[0];
      
      // Then get password hash
      const passwordResult = await pool.query(
        'SELECT password_hash FROM users.passwords WHERE user_id = $1',
        [user.user_id]
      );
      
      if (passwordResult.rows.length === 0) {
        return res.status(401).json({ authenticated: false, error: 'Password not set' });
      }
      
      const hashedPassword = passwordResult.rows[0].password_hash;
      
      // Compare passwords
      const match = await bcrypt.compare(password, hashedPassword);
      
      if (match) {
        res.json({ 
          authenticated: true, 
          user: {
            userId: user.user_id,
            email: user.email,
            userType: user.user_type,
            name: user.name
          }
        });
      } else {
        res.status(401).json({ authenticated: false, error: 'Invalid password' });
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

// Get type of user
export const getUserType = async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await pool.query(
        'SELECT user_type FROM users.user_accounts WHERE user_id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user_type: result.rows[0].user_type });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };