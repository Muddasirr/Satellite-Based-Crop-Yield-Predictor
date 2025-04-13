// pages/api/notes/index.js
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    
    const { data, error } = await supabase
      .from('Notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }

  

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
