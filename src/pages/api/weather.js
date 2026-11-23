// pages/api/weather.js
// Proxies OpenWeather so the API key stays on the server.
// Set OPENWEATHER_API_KEY in .env.local (local) and in the Vercel project env.
import axios from 'axios';

const ENDPOINTS = {
  weather: 'https://api.openweathermap.org/data/2.5/weather',
  forecast: 'https://api.openweathermap.org/data/2.5/forecast',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, type = 'weather' } = req.query;
  const url = ENDPOINTS[type];

  if (!q || !url) {
    return res.status(400).json({ error: 'Missing q or invalid type (weather | forecast)' });
  }
  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: 'OPENWEATHER_API_KEY is not configured' });
  }

  try {
    const { data } = await axios.get(url, {
      params: { q, units: 'metric', appid: process.env.OPENWEATHER_API_KEY },
    });
    return res.status(200).json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    return res.status(status).json({ error: error.response?.data?.message || 'Weather lookup failed' });
  }
}
