import pool from '../../../../lib/db';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Check if user exists
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();

        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
        }

        const user = result.rows[0];

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return new Response(JSON.stringify({ message: 'Login successful', token }), { status: 200 });
    } catch (error) {
        console.error(error,'llll');
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}
