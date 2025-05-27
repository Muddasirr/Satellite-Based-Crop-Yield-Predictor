import React from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const FieldDetails = ({ fields, fieldId }) => {
  const field = fields.find((f) => f.id === fieldId);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: "green", mb: 2 }}>
        <InfoIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        Field Details
      </Typography>

      {/* Basic Info */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
              <TableCell colSpan={2}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "green" }}>
                  <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                  Basic Info
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>🌾 Field Name</TableCell>
              <TableCell>{field?.name || "Unknown"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>📐 Area (ha)</TableCell>
              <TableCell>{field?.area || "0"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>🆔 Field ID</TableCell>
              <TableCell>{fieldId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>📅 Created Date</TableCell>
              <TableCell>
                {field?.created_at
                  ? new Date(field.created_at).toLocaleDateString()
                  : "Unknown"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Location Info */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
              <TableCell colSpan={2}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "green" }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                  Location Info
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>🧭 Latitude</TableCell>
              <TableCell>{field?.lat ?? "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>🧭 Longitude</TableCell>
              <TableCell>{field?.long ?? "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>🗺️ Coordinates</TableCell>
              <TableCell>
                <MapIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                {field?.lat?.toFixed(4) ?? "0.0000"}°N,&nbsp;
                {field?.long?.toFixed(4) ?? "0.0000"}°E
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Yield Prediction */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
              <TableCell colSpan={2}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "green" }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 1 }} />
                  Yield Prediction
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>📊 Prediction (kg/ha)</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "darkgreen" }}>
                {field?.prediction || "0"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FieldDetails;
