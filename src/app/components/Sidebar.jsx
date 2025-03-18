'use client'
import React from "react";
import { Box, Paper, IconButton } from "@mui/material";
import { 
  Calendar, SquaresFour, Smiley, MapPin, Upload, 
  FileText, Trash, BookOpen, Phone, User 
} from "@phosphor-icons/react";

const Sidebar = () => {
  return (
    <Paper 
      elevation={3} 
      sx={{
        width: "4vw", // Same as w-16 in Tailwind
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
      }}
    >
      {/* Logo */}
      <Box 
        sx={{
          backgroundColor: "#4CAF50", // Green color
          padding: "12px",
        
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold"
        }}
      >
        
      </Box>

      {/* Menu Items */}
      <SidebarItem icon={<Calendar size={24} />} />
      <SidebarItem icon={<SquaresFour size={24} />} active />
      <SidebarItem icon={<Smiley size={24} />} />
      <SidebarItem icon={<MapPin size={24} />} />
      <SidebarItem icon={<Upload size={24} />} />
      <SidebarItem icon={<FileText size={24} />} />
      <SidebarItem icon={<Trash size={24} />} />
      <SidebarItem icon={<BookOpen size={24} />} />
      <SidebarItem icon={<Phone size={24} />} />
      <SidebarItem icon={<User size={24} />} />
    </Paper>
  );
};

const SidebarItem = ({ icon, active }) => {
  return (
    <IconButton
      sx={{
        padding: "10px",
        borderRadius: "8px",
        transition: "background 0.2s",
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
        backgroundColor: active ? "#d6d6d6" : "transparent"
      }}
    >
      {icon}
    </IconButton>
  );
};

export default Sidebar;
