
import pool from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, role, password, name } = req.body;

    if (!email || !role || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      
      const result = await pool.query(
        'INSERT INTO users (email, role, password, name) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, role, password, name]
      );

      const newUser = result.rows[0];
      console.log(newUser)
      return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
