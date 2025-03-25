import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@mui/material";
import ClimateCharts from "./Chartsfields";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const  NDVIMap = () => {
  const ndviMapContainer = useRef(null);
  const satelliteMapContainer = useRef(null);
  const ndviMap = useRef();
  const satelliteMap = useRef();

  useEffect(() => {
    // Initialize NDVI Map
    ndviMap.current = new mapboxgl.Map({
      container: ndviMapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [35.0, 0.5], // Set initial position [longitude, latitude]
      zoom: 10,
    });

    // Adding NDVI visualization layer
    ndviMap.current.on('load', () => {
      ndviMap.current.addSource('ndvi-raster', {
        type: 'raster',
        tiles: ['https://example.com/ndvi-tiles/{z}/{x}/{y}.png'], // Replace with NDVI raster tile source
        tileSize: 256,
      });

      ndviMap.current.addLayer({
        id: 'ndvi-layer',
        type: 'raster',
        source: 'ndvi-raster',
        paint: {
          'raster-opacity': 0.7,
          'raster-hue-rotate': 180,
        },
      });
    });

    // Initialize Satellite Map
    satelliteMap.current = new mapboxgl.Map({
      container: satelliteMapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [35.0, 0.5],
      zoom: 10,
    });

    // Link map movements
    ndviMap.current.on('move', () => {
      satelliteMap.current.jumpTo({
        center: ndviMap.current.getCenter(),
        zoom: ndviMap.current.getZoom(),
      });
    });

    satelliteMap.current.on('move', () => {
      ndviMap.current.jumpTo({
        center: satelliteMap.current.getCenter(),
        zoom: satelliteMap.current.getZoom(),
      });
    });

    return () => {
      ndviMap.current?.remove();
      satelliteMap.current?.remove();
    };
  }, []);

  return (
    <Box>
    <Box  display={'flex'} >
      <div ref={ndviMapContainer} style={{ width: "50%", height: "500px" }} />
      <div ref={satelliteMapContainer} style={{ width: "50%", height: "500px" }} />
    </Box>
    <ClimateCharts/>
    </Box>
  );
}

export default NDVIMap;