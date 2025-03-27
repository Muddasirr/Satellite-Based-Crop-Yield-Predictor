'use client'
import React from "react";
import { Box, Button, Grid, Typography, Paper } from "@mui/material";
import StyledTextField from "../components/StyledTextField";

const SignupPage = () => {
  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Side - Background Image with Overlay */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: "relative",
          backgroundImage: "url(/farm.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
          borderRadius: "10px 0 0 10px",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(180deg, rgba(242, 243, 242, 0) 51%, rgba(242, 243, 242, 0.5) 100%)",
            borderRadius: "10px 0 0 10px",
          }}
        />
      </Grid>

      {/* Right Side - Form */}
      <Grid item xs={12} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            margin: "0 auto",
          
            maxWidth: "380px",
            padding: "2px", // Adjust padding for better spacing
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: "24px" }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Farm"
              sx={{
                width: "25%",
                height: "auto",
              }}
            />
            <Typography variant="h5" fontWeight={600}>
              Welcome to Agro.io
            </Typography>
            <Typography variant="body2" fontWeight={600} color="textSecondary">
              Create an account to access Agro.io and start setting up your farm and garden.
            </Typography>
          </Box>

          <Box component="form" noValidate sx={{ width: "100%", margin: "0 auto" }}>
            <StyledTextField fullWidth margin="normal" label="First Name" variant="outlined" />
            <StyledTextField fullWidth margin="normal" label="Last Name" variant="outlined" />
            <StyledTextField fullWidth margin="normal" label="Email Address" variant="outlined" />
            <StyledTextField fullWidth margin="normal" label="Password (8+ Characters)" type="password" variant="outlined" />

            <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: "12px" }}>
              By continuing, you agree to Fairm’s{" "}
              <a href="#" style={{ color: "#427662", textDecoration: "none", fontWeight: "bold" }}>Terms & Conditions</a> and{" "}
              <a href="#" style={{ color: "#427662", textDecoration: "none", fontWeight: "bold" }}>Privacy Policy</a>
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                backgroundImage: "linear-gradient(180deg, #A0BAB0 -19.79%, #427662 100%)",
                borderRadius: "10px",
              }}
            >
              Continue
            </Button>

            {/* Apple and Google login buttons with square borders */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  width: "45%", // Increased width for a better look
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  padding: "8px",
                  border: "2px solid #e4e7e6",
                }}
              >
                <Box component="img" src="/apple.png" alt="Apple logo" sx={{ width: 40, height: "auto" }} />
              </Button>

              <Typography variant="body2" sx={{ textAlign: "center", fontWeight: "600" }}>
                OR
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  width: "45%", // Increased width for a better look
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  padding: "8px",
                  border: "2px solid #e4e7e6",
                }}
              >
                <Box component="img" src="/google.png" alt="Google logo" sx={{ width: 24, height: "auto" }} />
              </Button>
            </Box>

            {/* Already have an account? Text */}
            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <a href="#" style={{ color: "#427662", textDecoration: "none", fontWeight: "bold" }}>
                Log In
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignupPage;