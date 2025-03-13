'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";

const API_KEY = "1a851bc9ce3b362243ba754f438ee258";

const WeatherDashboard = () => {
  const [location, setLocation] = useState("Lahore");
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchWeatherData(location);
  }, [location]);

  const fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <Box sx={{ padding: "40px", background: "linear-gradient(135deg, #6E7BFF, #0B0F32)", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px" }}>
        <Typography variant="h3" color="primary" align="center" gutterBottom>
          Weather Dashboard
        </Typography>

        <Box sx={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <TextField
            label="Enter City"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: "#f0f4f8", 
                borderRadius: "8px", 
              },
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => fetchWeatherData(location)} 
            sx={{ borderRadius: "8px", fontWeight: "bold", backgroundColor: "#6E7BFF", '&:hover': { backgroundColor: "#5e69e5" } }}
          >
            Get Weather
          </Button>
        </Box>

        {weatherData && (
          <Card sx={{ marginBottom: "24px", borderRadius: "8px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" color="text.primary" align="center">
                {weatherData.name}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-around", marginTop: "16px" }}>
                <Typography variant="h5" color="primary">Temperature: {weatherData.main.temp}°C</Typography>
                <Typography variant="h5" color="primary">Humidity: {weatherData.main.humidity}%</Typography>
              </Box>
              <Typography variant="h6" color="text.secondary" align="center" marginTop={2}>
                Weather: {weatherData.weather[0].description}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Typography variant="h5" color="primary" align="center" gutterBottom>
          Weather Map
        </Typography>
        <MapContainer 
          center={[31.5204, 74.3587]} 
          zoom={6} 
          style={{ height: "400px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer 
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`} 
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default WeatherDashboard;
