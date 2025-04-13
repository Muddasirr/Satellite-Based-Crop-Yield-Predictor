"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import axios from "axios";
import * as turf from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const ShowMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef();
  const drawRef = useRef();
  const [drawingMode, setDrawingMode] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const addField = async (data) => {
    try {
      const response = await axios.post("/api/fields/createfield", data );
      
      window.alert("Field Created Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to create field");
    }
  };

  const coordinates = [
    [67.0314, 24.8572], // near Saddar
    [67.0367, 24.8600], // near Saddar
    [67.0380, 24.8545], // near Saddar
    [67.0332, 24.8520], // near Saddar
    [67.0314, 24.8572]  // closing the loop
  ];
  
  const geojson = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coordinates], // This forms a closed polygon
    },
    properties: {},
  };
  
  

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [69.3451, 29.8497],
      zoom: 6,
      pitch: 45,
      bearing: 0,
      antialias: true,
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("mapbox-terrain", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      });

      mapRef.current.setTerrain({ source: "mapbox-terrain", exaggeration: 1.5 });

      mapRef.current.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 90.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
      mapRef.current.addSource("custom-polygon", {
        type: "geojson",
        data: geojson,
      });
    
      mapRef.current.addLayer({
        id: "custom-polygon-layer",
        type: "fill",
        source: "custom-polygon",
        layout: {},
        paint: {
          "fill-color": "#00ff00",
          "fill-opacity": 0.5,
        },
      });
    
      // Optional: Add an outline layer for the polygon
      mapRef.current.addLayer({
        id: "custom-polygon-outline",
        type: "line",
        source: "custom-polygon",
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 2,
        },
      });
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "simple_select",
    });

    drawRef.current = draw;
    mapRef.current.addControl(draw);

    mapRef.current.on("draw.create", async (e) => {
      if (!drawingMode) return;

      const polygon = e.features[0];
      const area = turf.area(polygon);
   


      const center = turf.centroid(polygon).geometry.coordinates;

      const confirm = window.confirm(
        `Field Name: ${fieldName}\nArea: ${area.toFixed(2)} sqm\nLocation: [${center[0].toFixed(
          5
        )}, ${center[1].toFixed(5)}]\n\nDo you want to create this field?`
      );

      if (confirm) {
        
        const data = {
          name: fieldName,
          area:area/1000,
          long:center[0],
          lat:center[1],
           coordinates: polygon.geometry.coordinates,
        };
        await addField(data);
        draw.deleteAll(); // reset draw
        setDrawingMode(false);
      } else {
        draw.deleteAll(); // delete drawn shape
        setDrawingMode(false);
      }
    });

    return () => mapRef.current.remove();
  }, [fieldName, drawingMode]);

  const startFieldCreation = () => {
    const name = window.prompt("Enter Field Name:");
    if (!name) return;

    setFieldName(name);
    setDrawingMode(true);
    drawRef.current.changeMode("draw_polygon");
  };

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <Fab
        color="success"
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
        onClick={startFieldCreation}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ShowMap;
