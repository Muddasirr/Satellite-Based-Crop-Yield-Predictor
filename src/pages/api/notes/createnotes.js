import { supabase } from '../../../../lib/supabase/client';

export default async function handler(req, res) {
  
  if (req.method === 'POST') {
    const { name, type, description, lat, long } = req.body;

    if (!name || !type || !lat || !long) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const { data, error } = await supabase.from('Notes').insert([
      {
        name,
        type,
        description,
        lat,
        long,
      },
    ]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
