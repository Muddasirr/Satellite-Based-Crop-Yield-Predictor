"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box, Fab, Modal, TextField, Button, Typography, Stack } from "@mui/material";
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
  const [openNameModal, setOpenNameModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [newFieldData, setNewFieldData] = useState(null);
  const [locationName,setlocationName]=useState('');
  const getLocationName = async (longitude, latitude) => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;
    try {
      const response = await axios.get(url);
      const features = response.data.features;
      const place = features.find(f => f.place_type.includes("place")) || features[0];
      return place?.place_name || "Unknown location";
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return "Error fetching location";
    }
  };

  const addField = async (data) => {
    try {
      await axios.post("/api/fields/createfield", data);
      alert("Field Created Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to create field");
    }
  };
  



  const handleFieldDraw = async (polygon) => {
    const area = turf.area(polygon);
    const center = turf.centroid(polygon).geometry.coordinates;
    const location= await getLocationName(center[0], center[1]);
  setlocationName(location);
    const data = {
      name: fieldName,
      area: area / 1000,
      long: center[0],
      lat: center[1],
      coordinates: polygon.geometry.coordinates,
      locationName:location,
    };

    setNewFieldData(data);
    setOpenConfirmModal(true);
  };

  const confirmCreateField = async () => {
    await addField(newFieldData);
    drawRef.current.deleteAll();
    setOpenConfirmModal(false);
    setDrawingMode(false);
  };

  const cancelCreateField = () => {
    drawRef.current.deleteAll();
    setOpenConfirmModal(false);
    setDrawingMode(false);
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
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
      defaultMode: "simple_select",
    });

    drawRef.current = draw;
    mapRef.current.addControl(draw);

    mapRef.current.on("draw.create", async (e) => {
      if (!drawingMode) return;
      const polygon = e.features[0];
      await handleFieldDraw(polygon);
    });

    return () => mapRef.current.remove();
  }, [drawingMode, fieldName]);

  const startFieldCreation = () => {
    setOpenNameModal(true);
  };

  return (
    <>
      <Box ref={mapContainerRef} sx={{ width: "100%", height: "100vh", position: "relative" }} />

      <Fab
        color="success"
        sx={{ position: "absolute", bottom: 20, right: 20 }}
        onClick={startFieldCreation}
      >
        <Add />
      </Fab>

      {/* Field Name Input Modal */}
      <Modal open={openNameModal} onClose={() => setOpenNameModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 300,
          }}
        >
          <Typography variant="h6" mb={2}>Enter Field Name</Typography>
          <TextField
            fullWidth
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Field name"
            variant="outlined"
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button onClick={() => setOpenNameModal(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpenNameModal(false);
                setDrawingMode(true);
                drawRef.current.changeMode("draw_polygon");
              }}
              disabled={!fieldName}
            >
              Draw
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Field Confirmation Modal */}
      <Modal open={openConfirmModal} onClose={cancelCreateField}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 350,
          }}
        >
          <Typography variant="h6" mb={2}>Confirm Field Creation</Typography>
          {newFieldData && (
            <>
              <Typography><strong>Name:</strong> {newFieldData.name}</Typography>
              <Typography><strong>Area:</strong> {newFieldData.area.toFixed(2)} sq.m</Typography>
              <Typography><strong>Location:</strong> {newFieldData.locationName}</Typography>
              <Typography><strong>Coordinates:</strong> [{newFieldData.lat.toFixed(5)}, {newFieldData.long.toFixed(5)}]</Typography>
            </>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button onClick={cancelCreateField}>Cancel</Button>
            <Button variant="contained" onClick={confirmCreateField}>Confirm</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ShowMap;
