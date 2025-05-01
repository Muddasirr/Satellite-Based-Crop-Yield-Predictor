import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  TextField,
  Divider,
  Fab,
} from "@mui/material";
import { ExpandMore, ExpandLess, Add, Sort } from "@mui/icons-material";
import axios from 'axios';
import useAuthStore from "../store/useAuthStore";
import ClimateCharts from "./Chartsfields";






const FieldManagement = () => {
  const store = useAuthStore();
  const setfields = store.setfields;

  const [fields, setFields] = useState([]);

  const [expanded, setExpanded] = useState(true);
  const [selectedFields, setSelectedFields] = useState([]);
  const [search, setSearch] = useState("");
  const [showAnalysis,setShowAnalysis] = useState(false);


  useEffect(() => {
    getfields();
  }, [])

  const getfields = async () => {
    const response = await axios.get('/api/fields/getfield');

    setFields(response.data.field)
    setfields(response.data.field)
  }
  const toggleExpand = () => setExpanded(!expanded);

  const handleSelect = (id) => {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((fieldId) => fieldId !== id) : [...prev, id]
    );
  };

  const filteredFields = fields?.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box width={'100%'} sx={{ display: "flex", height: "100vh", bgcolor: "#f4f4f4" }}>
      {/* Sidebar */}
      <Box sx={{ width: "45%", bgcolor: "white", p: 2, boxShadow: 1 }}>
        <Typography variant="h6" fontWeight="bold">

        </Typography>
        <Typography variant="body2" color="gray">
          Owner: Agro.io
        </Typography>

        <Box sx={{ mt: 2, bgcolor: "#eee", p: 1, borderRadius: 1 }}>
          <Typography variant="body1">📅 Season 2024</Typography>
        </Box>

        <Box sx={{ mt: "auto", pt: 2 }}>
          <Typography color="primary" >
            ➕ Create group
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box width={'55%'} sx={{ flex: 1, bgcolor: "white", boxShadow: 1, p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Season 2024
        </Typography>
        <Typography variant="body2" color="gray">
          811.5 ha
        </Typography>

        {/* Search and Sort */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton>
            <Sort />
          </IconButton>
        </Box>

        {/* Expandable Section */}
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mb: 1,
            }}
            onClick={toggleExpand}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Not activated fields
            </Typography>
            <Typography variant="body2" color="gray" sx={{ ml: 1 }}>
              811.5 ha
            </Typography>
          </Box>

          <Divider />

          {expanded && (
            <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
              <List>
                {filteredFields.map((field, index) => (
                  <ListItem onClick={()=>setShowAnalysis(true)} key={index}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "4px",
                          bgcolor: 'green',
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={field.name} secondary={`Area: ${field.area} ha`} />
                    <Checkbox
                      checked={selectedFields.includes(field.id)}
                      onChange={() => handleSelect(field.id)}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Box>
      {showAnalysis && <ClimateCharts open={showAnalysis} setOpen={()=>setShowAnalysis(false)}/>}




    </Box>
  );
};

export default FieldManagement;
