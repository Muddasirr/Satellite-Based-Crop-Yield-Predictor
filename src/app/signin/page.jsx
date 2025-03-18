'use client'
import React from "react";
import { Box, Button, Container, Grid, TextField, Typography, Paper } from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";




const Login = () => {
  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Side - Background Image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
            backgroundImage: "url(/farm.png)",

          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Right Side - Form */}
      <Grid item xs={12} md={6} component={Paper} elevation={6} square>
        <Box maxWidth="xs" px={16} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Box sx={{ textAlign: "center" }}>
          <Box
      component="img"
      src="/logo.png" 
      alt="Farm"
      sx={{
        width: "30%", 
        height: "auto",
       
      }}
    />
            <Typography variant="h5" fontWeight={600}>
              Welcome to Agro.io
            </Typography>
          
          </Box>
          
          <Box component="form" noValidate>
           
            <TextField fullWidth margin="normal" label="Email Address" variant="outlined" />
            <TextField fullWidth margin="normal" label="Password (8+ Characters)" type="password" variant="outlined" />
            
         
            
            <Button
  fullWidth
  variant="contained"
  sx={{
   mt:1,
    py: 1.5,
    backgroundImage: "linear-gradient(180deg, #A0BAB0 -19.79%, #427662 100%)",
  }}
>
  Login
</Button>

            
           
            
        
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
