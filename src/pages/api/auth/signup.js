import { supabase } from '../../../../lib/supabase/client';
import bcrypt from 'bcryptjs';


export default async function handler(req, res) {

  if (req.method === 'POST') {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('Users')
        .select()
        .eq('email', email);

      if (checkError) throw checkError;

      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const { data, error } = await supabase
        .from('Users')
        .insert([
          {
            email,
            password: hashedPassword,
            first_name,
            last_name,
          },
        ])
        .select();

      if (error) throw error;

      res.status(201).json({ message: 'User created successfully', user: data[0] });

    } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
