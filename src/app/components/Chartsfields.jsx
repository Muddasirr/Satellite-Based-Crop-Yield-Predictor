import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

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

const  ClimateCharts = () => {
  return (
    <div className="p-4">
      {/* NDVI Line Chart */}
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

      {/* Accumulated Precipitation Area Chart */}
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

      {/* Growing Degree-Days Area Chart */}
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
  );
}
export default ClimateCharts;
