import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import OpacityIcon from "@mui/icons-material/Opacity";

const forecastData = [
  { day: "Today", date: "Mar 25", temp: "+13° ...+24°", wind: "6 m/s →", cloud: "1%", humidity: "31%", dew: "0°", icon: <WbSunnyIcon /> },
  { day: "Wed", date: "Mar 26", temp: "+16° ...+26°", wind: "4 m/s →", cloud: "4%", humidity: "33%", dew: "+4°", icon: <WbSunnyIcon /> },
  { day: "Thu", date: "Mar 27", temp: "+18° ...+28°", wind: "4 m/s ↑", cloud: "6%", humidity: "31%", dew: "+5°", icon: <WbSunnyIcon /> },
  { day: "Fri", date: "Mar 28", temp: "+20° ...+31°", wind: "6 m/s ←", cloud: "24%", humidity: "26%", dew: "+4°", icon: <WbSunnyIcon /> },
  { day: "Sat", date: "Mar 29", temp: "+22° ...+34°", wind: "9 m/s ←", cloud: "31%", humidity: "21%", dew: "+3°", icon: <CloudIcon /> },
  { day: "Sun", date: "Mar 30", temp: "+20° ...+30°", wind: "9 m/s ↑", cloud: "65%", humidity: "43%", dew: "+11°", icon: <CloudIcon /> },
  { day: "Mon", date: "Mar 31", temp: "+20° ...+27°", wind: "8 m/s", cloud: "4%", humidity: "46%", dew: "+10°", icon: <WbSunnyIcon /> },
];

const WeatherTable = ()=> {
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#f7f8fc", borderRadius: "12px" }}>
      <Typography variant="h6" sx={{ padding: 2, fontWeight: "bold" }}>Forecast</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}> </TableCell>
            {forecastData.map((day) => (
              <TableCell key={day.day} align="center" sx={{ fontWeight: "bold" }}>
                {day.day}
                <Typography variant="caption" display="block" color="textSecondary">
                  {day.date}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Temperature</TableCell>
            {forecastData.map((day) => (
              <TableCell key={day.day} align="center">
                <Typography sx={{ fontWeight: "bold" }}>{day.temp}</Typography>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Precipitation</TableCell>
            {forecastData.map((day) => (
              <TableCell key={day.day} align="center">0 mm</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Wind</TableCell>
            {forecastData.map((day) => (
              <TableCell key={day.day} align="center">{day.wind}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Cloud cover</TableCell>
            {forecastData.map((day) => (
              <TableCell key={day.day} align="center">{day.cloud}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Humidity</TableCell>
            {forecastData.map((day) => (
              <TableCell key={day.day} align="center">{day.humidity}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Dew point</TableCell>
            {forecastData.map((day) => (
              <TableCell key={day.day} align="center">{day.dew}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell> </TableCell>
            {forecastData.map((day) => (
              <TableCell key={day.day} align="center">
                <Box display="flex" justifyContent="center">{day.icon}</Box>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WeatherTable