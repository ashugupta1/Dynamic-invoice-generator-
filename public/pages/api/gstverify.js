// pages/api/gstverify.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(
        'https://gst-details2.p.rapidapi.com/GST/Gstverify',
        {
          gstnumber: '27AAACR5055K1Z7',
          consent: 'Y',
          consent_text: 'I hereby declare my consent agreement for fetching my information via way2risetech API',
        },
        {
          headers: {
            'x-rapidapi-key': '9f939e499cmsh680e08634c50a50p16cbbdjsne74057f6ede2',
            'x-rapidapi-host': 'gst-details2.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching GST details', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
