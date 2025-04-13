import  {supabase} from '../../../../lib/supabase/client';
export default async function handler(req, res) {
  if (req.method === 'GET') {
   

    try {

        


        const { data, error } = await supabase
        .from('Fields')
        .select('*');
        

      if (error) throw error;

      if (data.length > 0) {
        res.status(200).json({ message: 'Fields fetched', field: data });
      } else {
        res.status(401).json({ message: 'No fields exist' });
      }
     
    
    } catch (error) {
      console.error('Error fetching in:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}