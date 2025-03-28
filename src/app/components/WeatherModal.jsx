import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  Typography, 
  Box, 
  TextField, 
  Grid, 
  LinearProgress, 
  IconButton,
  Button,
  Card,
  Divider,
  Chip
} from "@mui/material";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from "recharts";
import CloseIcon from "@mui/icons-material/Close";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import WeatherTable from "./WeatherTable";
import NDVIMap from "./MapModal";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import CompressIcon from "@mui/icons-material/Compress";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import axios from "axios";
import { styled } from "@mui/system";
import { format, fromUnixTime } from "date-fns";

// Weather condition to background mapping
const weatherBackgrounds = {
  'clear': 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  'clouds': 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
  'rain': 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
  'thunderstorm': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'snow': 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
  'mist': 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
  'default': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
};

// Styled Components
const WeatherCard = styled(Card)(({ weathercondition, theme }) => ({
  background: weatherBackgrounds[weathercondition] || weatherBackgrounds.default,
  borderRadius: '16px',
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
  transition: 'background 0.5s ease',
}));

const WeatherIcon = styled('img')({
  width: '80px',
  height: '80px',
  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
});

const TemperatureText = styled(Typography)({
  fontSize: '3.5rem',
  fontWeight: 300,
  lineHeight: 1,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
});

const LocationText = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
});

const DetailText = styled(Typography)({
  fontSize: '0.9rem',
  fontWeight: 400,
  opacity: 0.9,
});

const WeatherDetailCard = styled(Box)({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderRadius: '12px',
  padding: '12px',
  backdropFilter: 'blur(5px)',
});

const WeatherModal = ({ open, handleClose }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("Tegal, Indonesia");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState('default');

  const apiKey = "56811987bfa156cfa0f0502335732dc5"; // OpenWeather API key

  useEffect(() => {
    if (open) {
      fetchWeatherData();
    }
  }, [open, location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
      );
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
      );
      setWeatherData(weatherResponse.data);
      
      // Set weather condition for background
      const mainCondition = weatherResponse.data.weather[0].main.toLowerCase();
      setWeatherCondition(mainCondition);

      // Prepare chart data
      const chartTempData = forecastResponse.data.list
        .filter((_, index) => index < 8) // Next 24 hours (3-hour intervals)
        .map((item) => ({
          time: format(new Date(item.dt_txt), 'h a'),
          date: format(new Date(item.dt_txt), 'MMM d'),
          temp: Math.round(item.main.temp),
          humidity: item.main.humidity,
          feels_like: Math.round(item.main.feels_like),
          pressure: item.main.pressure,
        }));
      setChartData(chartTempData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Location not found. Please try another city.");
      setWeatherData(null);
      setWeatherCondition('default');
    }
    setLoading(false);
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getCurrentTime = () => {
    if (!weatherData) return '';
    return format(fromUnixTime(weatherData.dt), 'h:mm a, MMMM d');
  };

  const getSunriseSunsetTime = (timestamp) => {
    return format(fromUnixTime(timestamp), 'h:mm a');
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)} fullWidth maxWidth="md">
      <DialogContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Weather</Typography>
          <IconButton onClick={() => handleClose(false)}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <NDVIMap />
        <Typography variant="subtitle1">Field 1</Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[
            { label: "Temperature", dataKey: "temperature", unit: "°C", icon: <ThermostatIcon /> },
            { label: "Wind", dataKey: "wind", unit: "m/s", icon: <AirIcon /> },
            { label: "Cloud cover", dataKey: "cloud", unit: "%", icon: <CloudQueueIcon /> },
            { label: "Humidity", dataKey: "humidity", unit: "%", icon: <WaterDropIcon /> },
            { label: "Dew point", dataKey: "dew", unit: "°C", icon: <ThermostatIcon /> },
          ].map((item, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>{item.icon}</Grid>
                    <Grid item>
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="h6">
                        {weatherData[0][item.dataKey]}{item.unit}
                      </Typography>
                    </Grid>
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        style: {
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#f5f7fa',
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {loading && <LinearProgress />}
        
        <WeatherCard weathercondition={weatherCondition}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h5" fontWeight="600">
                Weather Forecast
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeatherData()}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                  }
                }}
              />
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>

            {weatherData && (
              <>
                {/* Current Weather Section */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Box>
                    <LocationText>
                      <LocationOnIcon />
                      {weatherData.name}, {weatherData.sys.country}
                    </LocationText>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                      {getCurrentTime()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <WeatherIcon 
                      src={getWeatherIconUrl(weatherData.weather[0].icon)} 
                      alt={weatherData.weather[0].main}
                    />
                    <Typography variant="h6" sx={{ textTransform: 'capitalize', mt: -1 }}>
                      {weatherData.weather[0].description}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3
                }}>
                  <TemperatureText>
                    {Math.round(weatherData.main.temp)}°C
                  </TemperatureText>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">
                      H: {Math.round(weatherData.main.temp_max)}° L: {Math.round(weatherData.main.temp_min)}°
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                      <Chip 
                        icon={<WbSunnyIcon />} 
                        label={`Sunrise: ${getSunriseSunsetTime(weatherData.sys.sunrise)}`} 
                        size="small"
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      />
                      <Chip 
                        icon={<WbSunnyIcon />} 
                        label={`Sunset: ${getSunriseSunsetTime(weatherData.sys.sunset)}`} 
                        size="small"
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />

                {/* Weather Details Grid */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <WeatherDetailCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <ThermostatIcon fontSize="small" />
                        <DetailText>Feels Like</DetailText>
                      </Box>
                      <Typography variant="h6">{Math.round(weatherData.main.feels_like)}°C</Typography>
                    </WeatherDetailCard>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <WeatherDetailCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <WaterDropIcon fontSize="small" />
                        <DetailText>Humidity</DetailText>
                      </Box>
                      <Typography variant="h6">{weatherData.main.humidity}%</Typography>
                    </WeatherDetailCard>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <WeatherDetailCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AirIcon fontSize="small" />
                        <DetailText>Wind</DetailText>
                      </Box>
                      <Typography variant="h6">{weatherData.wind.speed} m/s</Typography>
                    </WeatherDetailCard>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <WeatherDetailCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CompressIcon fontSize="small" />
                        <DetailText>Pressure</DetailText>
                      </Box>
                      <Typography variant="h6">{weatherData.main.pressure} hPa</Typography>
                    </WeatherDetailCard>
                  </Grid>
                </Grid>

                {/* Temperature Chart */}
                <Box sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  p: 2,
                  mb: 3,
                  backdropFilter: 'blur(5px)',
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    24 Hour Forecast - {chartData[0]?.date}
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fill: 'rgba(255, 255, 255, 0.8)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(255, 255, 255, 0.8)' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        name="Temperature (°C)"
                        type="monotone" 
                        dataKey="temp" 
                        stroke="#ffcc33" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        name="Feels Like (°C)"
                        type="monotone" 
                        dataKey="feels_like" 
                        stroke="#ff6666" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <WeatherTable />
        
        {/* Close Button */}
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleClose(false)}>
            Close
          </Button>
        </Grid>
                </Box>

                {/* Humidity Chart */}
                <Box sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  p: 2,
                  backdropFilter: 'blur(5px)',
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Humidity Forecast
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fill: 'rgba(255, 255, 255, 0.8)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(255, 255, 255, 0.8)' }}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Area 
                        name="Humidity (%)"
                        type="monotone" 
                        dataKey="humidity" 
                        stroke="#4dabf5" 
                        fill="#4dabf5"
                        fillOpacity={0.2}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}
          </Box>
        </WeatherCard>
      </DialogContent>
    </Dialog>
  );
};

export default WeatherModal;
