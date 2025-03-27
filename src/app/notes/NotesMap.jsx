"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { 
  Box, 
  Button, 
  Modal, 
  TextField, 
  MenuItem, 
  Paper, 
  Typography, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PlaceIcon from "@mui/icons-material/Place";
import "mapbox-gl/dist/mapbox-gl.css";

// Initialize mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const NotesMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState(null);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    field: "",
    noteType: "",
    comment: "",
    image: null
  });
  const [isAddingNote, setIsAddingNote] = useState(false);

  const noteTypes = [
    "Pest",
    "Disease",
    "Weed",
    "Nutrient Deficiency",
    "Irrigation",
    "Other"
  ];

  const fields = [
    "Field A",
    "Field B",
    "Field C",
    "Zambia - Lusaka",
    "Zimbabwe - Harare",
    "Mozambique - Channel",
    "Botswana - Gaborone",
    "South Africa - Pretoria",
    "South Africa - Johannesburg",
    "Eswatini",
    "Lesotho - Bloemfontein",
    "South Africa - Durban",
    "South Africa - East London",
    "South Africa - Gqeberha",
    "Tanzania - Dar es Salaam",
    "Comoros - Mayotte",
    "Mozambique - Tolara"
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [34.8516, -15.4167],
      zoom: 4,
    });

    mapRef.current = map;

    const handleMapClick = (e) => {
      if (isAddingNote) {
        const clickedLngLat = e.lngLat;
        setNewNote({
          lng: clickedLngLat.lng,
          lat: clickedLngLat.lat
        });
        setOpenNoteModal(true);
        setIsAddingNote(false);

        new mapboxgl.Marker()
          .setLngLat([clickedLngLat.lng, clickedLngLat.lat])
          .addTo(mapRef.current);

        // Reset cursor to default
        mapContainerRef.current.style.cursor = '';
      }
    };

    map.on("click", handleMapClick);

    loadNotes();

    return () => {
      map.off("click", handleMapClick);
      map.remove();
    };
  }, [isAddingNote]);

  const loadNotes = () => {
    const mockNotes = [
      {
        id: 1,
        lng: 35.3080,
        lat: -15.3875,
        field: "Field A",
        noteType: "Pest",
        comment: "Found armyworms in this area",
        date: "2023-05-15"
      },
      {
        id: 2,
        lng: 31.0567,
        lat: -17.8292,
        field: "Zimbabwe - Harare",
        noteType: "Disease",
        comment: "Signs of rust fungus detected",
        date: "2023-05-18"
      }
    ];
    setNotes(mockNotes);
    addMarkers(mockNotes);
  };

  const addMarkers = (notes) => {
    if (!mapRef.current) return;

    // Clear existing markers
    document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

    notes.forEach(note => {
      new mapboxgl.Marker()
        .setLngLat([note.lng, note.lat])
        .addTo(mapRef.current);
    });
  };

  const handleStartAddingNote = () => {
    setIsAddingNote(true);

    mapContainerRef.current.style.cursor = 'crosshair';
  };

  const handleCancelAddingNote = () => {
    setIsAddingNote(false);
    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = ''; 
    }
  };

  const handleSaveNote = () => {
    if (!newNote) return;

    const newNoteWithDetails = {
      ...newNote,
      ...noteForm,
      id: notes.length + 1,
      date: new Date().toISOString()
    };

    setNotes([...notes, newNoteWithDetails]);
    addMarkers([...notes, newNoteWithDetails]);
    setOpenNoteModal(false);
    setNoteForm({
      field: "",
      noteType: "",
      comment: "",
      image: null
    });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>

      <Box sx={{ 
        width: "350px", 
        borderRight: "1px solid #e0e0e0",
        overflowY: "auto"
      }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notes</Typography>
          <Divider sx={{ my: 2 }} />
          <List>
            {notes.length === 0 ? (
              <Typography sx={{ p: 2 }}>No notes yet. Click "Add Note" and then click on the map.</Typography>
            ) : (
              notes.map((note) => (
                <ListItem key={note.id} button>
                  <ListItemText
                    primary={note.field}
                    secondary={`${note.noteType} - ${note.comment.substring(0, 30)}...`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Box>

      {/* Map Area */}
      <Box sx={{ 
        flexGrow: 1,
        position: "relative"
      }}>
        <Box 
          ref={mapContainerRef} 
          sx={{ 
            width: "100%",
            height: "100%"
          }} 
        />

        {/* Floating Add Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "absolute",
            bottom: 32,
            right: 32,
            backgroundColor: isAddingNote ? "#f44336" : "#4CAF50",
            "&:hover": {
              backgroundColor: isAddingNote ? "#d32f2f" : "#388E3C"
            }
          }}
          onClick={isAddingNote ? handleCancelAddingNote : handleStartAddingNote}
        >
          {isAddingNote ? <CloseIcon /> : <AddIcon />}
        </Fab>

        {isAddingNote && (
          <Box sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px"
          }}>
            <Typography>Click on map to place note</Typography>
          </Box>
        )}
      </Box>


      <Modal 
        open={openNoteModal} 
        onClose={() => setOpenNoteModal(false)}
        aria-labelledby="note-modal-title"
      >
        <Paper sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          p: 3,
          outline: "none"
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" id="note-modal-title">New note</Typography>
            <IconButton onClick={() => setOpenNoteModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            select
            fullWidth
            label="Field"
            value={noteForm.field}
            onChange={(e) => setNoteForm({...noteForm, field: e.target.value})}
            sx={{ mb: 2 }}
          >
            {fields.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Note type"
            value={noteForm.noteType}
            onChange={(e) => setNoteForm({...noteForm, noteType: e.target.value})}
            sx={{ mb: 2 }}
          >
            {noteTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comment"
            value={noteForm.comment}
            onChange={(e) => setNoteForm({...noteForm, comment: e.target.value})}
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setNoteForm({
                ...noteForm, 
                image: e.target.files?.[0] || null
              })}
            />
          </Button>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setOpenNoteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveNote}
              disabled={!noteForm.field || !noteForm.noteType}
              sx={{ backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#388E3C" } }}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default NotesMap;
