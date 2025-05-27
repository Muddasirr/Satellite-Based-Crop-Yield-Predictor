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


const FieldTable = ( fields) => {
   
    return (
      <TableContainer component={Paper}>
        <Table aria-label="field table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Area</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.lat}</TableCell>
                <TableCell>{field.long}</TableCell>
                <TableCell>{field.area} ha</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
};

export default FieldTable;
