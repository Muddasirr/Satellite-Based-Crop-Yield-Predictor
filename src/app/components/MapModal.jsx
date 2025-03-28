import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@mui/material";
import ClimateCharts from "./Chartsfields";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const NDVIMap = () => {
  const ndviMapContainer = useRef(null);
  const satelliteMapContainer = useRef(null);
  const ndviMap = useRef(null);
  const satelliteMap = useRef(null);
  const lastSyncedView = useRef({ center: null, zoom: null });

  useEffect(() => {
    const ndviDate = new Date();
    ndviDate.setDate(ndviDate.getDate() - 3); // Fetch data from 3 days ago
    const formattedDate = ndviDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const initializeMap = (container, center, zoom) =>
      new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/satellite-v9",
        center,
        zoom,
      });

    // Initialize NDVI and Satellite Maps
    ndviMap.current = initializeMap(ndviMapContainer.current, [35.0, 0.5], 10);
    satelliteMap.current = initializeMap(satelliteMapContainer.current, [35.0, 0.5], 10);

    ndviMap.current.on("load", () => {
      ndviMap.current.addSource("ndvi-raster", {
        type: "raster",
        tiles: [
          `https://services.sentinel-hub.com/ogc/wmts/74ebbd69-a955-4476-aaf7-bd18cca9cdb7?
          REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&
          LAYER=NDVI&STYLE=&FORMAT=image/png&
          TILEMATRIXSET=GoogleMapsCompatible&
          TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&
          TIME=${formattedDate}`
        ],
        tileSize: 256,
      });

      ndviMap.current.addLayer({
        id: "ndvi-layer",
        type: "raster",
        source: "ndvi-raster",
        paint: {
          "raster-opacity": 0.7,
        },
      });
    });

    // Synchronize map movements
    // const syncMaps = (sourceMap, targetMap) => {
    //   const center = sourceMap.getCenter();
    //   const zoom = sourceMap.getZoom();
    //   const lastView = lastSyncedView.current;

    //   // Prevent infinite loop by checking if view is already synced
    //   if (lastView.center && lastView.center.equals(center) && lastView.zoom === zoom) return;
    //   lastSyncedView.current = { center, zoom };
    //   targetMap.jumpTo({ center, zoom });
    // };

    // ndviMap.current.on("move", () => syncMaps(ndviMap.current, satelliteMap.current));
    // satelliteMap.current.on("move", () => syncMaps(satelliteMap.current, ndviMap.current));

    // Clean up on component unmount
    return () => {
      ndviMap.current?.remove();
      satelliteMap.current?.remove();
    };
  }, []);

  return (
    <Box>
      <Box display="flex">

        <div ref={ndviMapContainer} style={{ width: "50%", height: "500px" }} />
        <div ref={satelliteMapContainer} style={{ width: "50%", height: "500px" }} />
      </Box>
      <ClimateCharts />
    </Box>
  );
};

export default NDVIMap;
