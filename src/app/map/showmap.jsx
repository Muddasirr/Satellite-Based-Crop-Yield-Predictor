"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@mui/material";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import axios from "axios";
import * as turf from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const ShowMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef();
  const [agriculturalData, setAgriculturalData] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, // Map container reference
      style: "mapbox://styles/mapbox/satellite-streets-v12", // Terrain & satellite view
      center: [69.3451, 29.8497], // Center on Punjab and Sindh
      zoom: 6,
      pitch: 45, // Tilting the map for a 3D effect
      bearing: 0,
      antialias: true, // Smoother edges for 3D
    });

    // Add terrain source
    mapRef.current.on("load", () => {
      mapRef.current.addSource("mapbox-terrain", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      });

      // Apply terrain with exaggeration
      mapRef.current.setTerrain({ source: "mapbox-terrain", exaggeration: 1.5 });

      // Optional: Add a sky layer for a better 3D effect
      mapRef.current.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 90.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
    });

    // Add Draw control
    const draw = new MapboxDraw({
      displayControlsDefault: true,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    mapRef.current.addControl(draw);

    // Handle drawing completion
    mapRef.current.on("draw.create", (e) => {
      const polygon = e.features[0];
      const coordinates = polygon.geometry.coordinates[0];

      console.log("Polygon Coordinates:", coordinates);

      const area = turf.area(polygon);
      console.log("Area of Polygon:", area);
    });

    // Cleanup on unmount
    return () => mapRef.current.remove();
  }, []);

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        width: "100%",
        height: "100vh",
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
