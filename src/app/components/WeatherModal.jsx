import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import WeatherTable from "./WeatherTable";
import NDVIMap from "./MapModal";

const WeatherModal = ({ open, handleClose }) => {
  const weatherData = [
    { time: "Now", temperature: 20, wind: 4, cloud: 2, humidity: 30, dew: 3 },
    { time: "08:00", temperature: 22, wind: 5, cloud: 5, humidity: 32, dew: 4 },
    { time: "11:00", temperature: 23, wind: 6, cloud: 8, humidity: 34, dew: 5 },
    { time: "19:00", temperature: 21, wind: 4, cloud: 3, humidity: 31, dew: 3 },
  ];

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
                  </Grid>
                  <ResponsiveContainer width="100%" height={50}>
                    <BarChart data={weatherData}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey={item.dataKey} barSize={1} fill="#ff7300" />
                    </BarChart>
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
      </DialogContent>
    </Dialog>
  );
};

export default WeatherModal;
