
import  {supabase} from '../../../../lib/supabase/client';
export default async function handler(req, res) {
  if (req.method === 'POST') {
   

    const { email, password } = req.body;

    try {
      const { data, error } = await supabase
        .from('Users')
        .select()
        .eq('email', email)
        .eq('password', password) 

      if (error) throw error;

      if (data.length > 0) {
        res.status(200).json({ message: 'Login successful', user: data[0] });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }

    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
