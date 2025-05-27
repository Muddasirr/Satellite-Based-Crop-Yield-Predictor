import { supabase } from '../../../../lib/supabase/client';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, long, lat, area, coordinates,locationName } = req.body;

    try {
   
      const location = locationName.split(',')[0].trim(); // simple cleanup
      const response = await axios.post(
        `http:///127.0.0.1:8000/predict/?long=${Number(long)}&lat=${Number(lat)}&name=${location}&year=2024`
      );

      const prediction = response.data.prediction;

 
      const { data, error } = await supabase.from('Fields').insert([
        {
          name,
          long,
          lat,
          area,
          coordinates,
          prediction,
        },
      ]);

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(400).json({ message: 'Insert failed', error });
      }
      
      const fields = await supabase.from('Fields').select('*');


      return res.status(200).json({ message: 'Insert successful', data:fields});
    } catch (err) {
      console.error('Internal server error:', err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
