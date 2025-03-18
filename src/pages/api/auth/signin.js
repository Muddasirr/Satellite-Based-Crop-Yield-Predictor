
import { NextApiRequest, NextApiResponse } from 'next';
import pool from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
     
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = rows[0];

     
      if (user.password === password) {
     
        return res.status(200).json({ message: 'Login successful', user: { email, name: user.name, role: user.role } });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
