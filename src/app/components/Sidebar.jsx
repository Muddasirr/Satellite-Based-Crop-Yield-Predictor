'use client'
import { useState } from "react";
import { Box, Paper, IconButton } from "@mui/material";
import { Calendar, SquaresFour, Smiley, MapPin, Upload, FileText, Trash, BookOpen, Phone, User, Cloud } from "@phosphor-icons/react";
import WeatherModal from "./WeatherModal";  // Modal component
import { useRouter } from "next/navigation";
import { Chat } from "@mui/icons-material";
const Sidebar = () => {
  const router = useRouter();
  const [openWeather, setOpenWeather] = useState(false);

  const handleWeatherClick = () => setOpenWeather(true);

  const handlenotesclick = () => {
    router.push('/dashboard/notes');
  }

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
        component="img"
        src="/logo.png"
        onClick={() => router.push('/dashboard/map')}
        sx={{
          width: "100%",
          height: "auto",
        }}
      >
      </Box>

      {/* Menu Items */}
      <SidebarItem icon={<SquaresFour size={24} />} active />

      <SidebarItem  icon={<MapPin size={24} />} onClick={handlenotesclick} />
      

      <SidebarItem icon={<Chat size={24} />} onClick={()=>router.push('/dashboard/chatbot')} />
      {/* Weather Icon */}
      <SidebarItem icon={<Cloud size={24} />} onClick={handleWeatherClick} />
      <WeatherModal open={openWeather} handleClose={() => setOpenWeather(false)} />
    </Paper>
  );
};

const SidebarItem = ({ icon, active, onClick }) => {
  return (
    <IconButton
      onClick={onClick}
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
