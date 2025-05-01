import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,


} from "recharts";

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog
} from '@mui/material';

import useAuthStore from "../store/useAuthStore";
const ndviData = [
  { month: "Jan", value: 0.1 },
  { month: "Feb", value: 0.12 },
  { month: "Mar", value: 0.15 },
  { month: "Apr", value: 0.1 },
  { month: "May", value: 0.09 },
  { month: "Jun", value: 0.11 },
  { month: "Jul", value: 0.1 },
  { month: "Aug", value: 0.1 },
  { month: "Sep", value: 0.1 },
  { month: "Oct", value: 0.08 },
  { month: "Nov", value: 0.09 },
  { month: "Dec", value: 0.1 },
];

const precipitationData = [
  { month: "Jan", value: 10 },
  { month: "Feb", value: 20 },
  { month: "Mar", value: 40 },
  { month: "Apr", value: 60 },
  { month: "May", value: 80 },
  { month: "Jun", value: 90 },
  { month: "Jul", value: 100 },
  { month: "Aug", value: 110 },
  { month: "Sep", value: 114 },
  { month: "Oct", value: 114 },
  { month: "Nov", value: 114 },
  { month: "Dec", value: 114 },
];

const degreeDaysData = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 200 },
  { month: "Mar", value: 800 },
  { month: "Apr", value: 1500 },
  { month: "May", value: 2200 },
  { month: "Jun", value: 3000 },
  { month: "Jul", value: 3700 },
  { month: "Aug", value: 4200 },
  { month: "Sep", value: 4700 },
  { month: "Oct", value: 4792 },
  { month: "Nov", value: 4792 },
  { month: "Dec", value: 4792 },
];


const ClimateCharts = (props) => {
  const store = useAuthStore();
  const fields = store.fields;

  const getAnalysis = async () => {
    const input = `Here is some data about my field:

    - Predicted Rice Yield: ${fields.filter((field) => field.id == props.id)[0].prediction} kg/ha
    - Predicted Maize Yield: ${Math.floor(Math.random() * (3400 - 1700) + 1700)} kg/ha
    
    Current average prices in Pakistan:
    - Rice (retail): PKR 82 to 136 per kg; Basmati (e.g., Kainat): ~PKR 262 per kg
    - Maize (retail): PKR 87 to 186 per kg; Wholesale in Punjab: PKR 20–22/kg; in KPK: PKR 26–31/kg
    
    Demand trends in Pakistan:
    - Maize has high domestic demand (~9.1 million tons), mainly for poultry and dairy feed.
    - Rice is more export-focused and price-sensitive to international markets.
    
    Based on the predicted yields, current market prices, and demand trends within Pakistan, please provide a **clear recommendation** on whether I should grow **rice or maize**. Do **not** ask further questions—just analyze this data and give me your suggestion for what to plant for maximum profitability.`;
    
    const res = await fetch(`/api/chat?question=${encodeURIComponent(input)}`);
    const data = await res.json()
    console.log(data.response)
  }
  useEffect(() => {
    getAnalysis();
  }, [])

  console.log(fields.filter((field) => field.id == props.id));
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
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
      <FieldTable fields={fields.filter((field) => field.id == props.id)} />
      <div className="p-4">

        <h3 className="mb-2 text-lg font-semibold">NDVI</h3>

        <ResponsiveContainer width="100%" height={150}>

          <LineChart data={ndviData}>
            <XAxis dataKey="month" />
            <YAxis domain={[-0.35, 1.05]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#d32f2f"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>


        <h3 className="mb-2 text-lg font-semibold">Accumulated Precipitation</h3>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={precipitationData}>
            <defs>
              <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2196f3"
              fillOpacity={1}
              fill="url(#colorPrecip)"
            />
          </AreaChart>
        </ResponsiveContainer>


        <h3 className="mb-2 text-lg font-semibold">Growing Degree-Days</h3>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={degreeDaysData}>
            <defs>
              <linearGradient id="colorGDD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ff9800"
              fillOpacity={1}
              fill="url(#colorGDD)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </Dialog>
  );
}
export default ClimateCharts;



function FieldTable({ fields }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="field table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Latitude</TableCell>
            <TableCell align="right">Longitude</TableCell>
            <TableCell align="right">Area</TableCell>
            <TableCell align="right">Prediction</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.lat}</TableCell>
              <TableCell align="right">{row.long}</TableCell>
              <TableCell align="right">{row.area}</TableCell>
              <TableCell align="right">{row.prediction}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}