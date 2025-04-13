import { request } from 'http';
import { supabase } from '../../../../lib/supabase/client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("request",req.body)
    const { name, long, lat, area,coordinates } = req.body;

    try {
      const { data, error } = await supabase
        .from('Fields')
        .insert([
          {
            name,
            long,
            lat,
            area,
            coordinates
          }
        ]);

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(400).json({ message: 'Insert failed', error });
      }

      return res.status(200).json({ message: 'Insert successful', data });
    } catch (err) {
      console.error('Internal server error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
