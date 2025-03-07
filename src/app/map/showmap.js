"use client";

import { useEffect, useRef,useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@mui/material";
import mapboxGlDraw from "@mapbox/mapbox-gl-draw";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import axios from 'axios';

import * as turf from '@turf/turf';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const ShowMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef();
  const [agriculturalData, setAgriculturalData] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, // Map container reference
      style: "mapbox://styles/mapbox/streets-v11", // Map style
      center: [69.3451, 29.8497], // Center on Punjab and Sindh
      zoom: 5,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: true,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });

    mapRef.current.addControl(draw);
    
    mapRef.current.on('draw.create', async (event) => {
      const drawnPolygon = event.features[0];
      console.log(drawnPolygon.geometry.coordinates); // Polygon coordinates in GeoJSON format

      // Fetch agricultural data for the selected region
      await fetchAgriculturalData(drawnPolygon.geometry.coordinates);
    });
  

    mapRef.current.on('draw.create', (e) => {
      console.log(e);
      // Get the GeoJSON feature for the drawn polygon
      const polygon = e.features[0];

      // Extract the coordinates of the polygon
      const coordinates = polygon.geometry.coordinates[0]; // First ring of the polygon

      // Log the coordinates of the polygon
      console.log('Polygon Coordinates:', coordinates);

      // If you want to extract endpoints or vertices, they are simply the first and last points in the coordinates array
      const startPoint = coordinates[0];
      const endPoint = coordinates[coordinates.length - 1];

      console.log('Start Point:', startPoint);
      console.log('End Point:', endPoint);

      // If you want to further process the polygon, you can use Turf.js to calculate areas, distances, etc.
      const area = turf.area(polygon); // Calculate the area of the polygon
      console.log('Area of Polygon:', area);
    });

    // Cleanup on unmount
    return () => mapRef.current.remove();
  }, []);

  const fetchAgriculturalData = async (polygonCoordinates) => {
    try {
      const response = await axios.post(
        "https://api.agromonitoring.com/agro/1.0/ndvi/history", // Endpoint for NDVI (vegetation index) data, can be changed based on your need
        {
          polygon: polygonCoordinates, // The drawn polygon (GeoJSON format)
          start: "2025-01-01", // Start date
          end: "2025-01-31", // End date
          apiKey: process.env.NEXT_PUBLIC_AGRO_ACCESS_TOKEN, 
        }
      );

      setAgriculturalData(response.data); // Store the fetched data in state
      console.log(response.data); // This will contain NDVI data or other agricultural features

    } catch (error) {
      console.error("Error fetching agricultural data:", error);
    }
  };
  return (
    <Box
    ref={mapContainerRef}
    sx={{
      width: "100%",
      height: "500px",
      position: "relative",
    }}
  >
    {agriculturalData && (
      <div>
        <h2>Agricultural Data:</h2>
        <pre>{JSON.stringify(agriculturalData, null, 2)}</pre>
      </div>
    )}
  </Box>
  );
};

export default ShowMap;
