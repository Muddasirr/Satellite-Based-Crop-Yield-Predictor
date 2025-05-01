'use client'
import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const OnboardingPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {/* Image Section - Top Horizontal */}
    <Box sx={{ 
      width: "100%", 
      height: { xs: "250px", sm: "350px", md: "400px" }, // Increased heights
      position: "relative",
      overflow: "hidden" // Prevents pixel distortion
    }}>
      <Image
        src="/onboarding.png"
        alt="Field illustration"
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
        quality={90} // Optimized quality setting
        priority // Prevents lazy loading
      />
    </Box>
      {/* Content Section */}
      <Container maxWidth="sm" sx={{ flex: 1, py: 4, px: 3 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight={550}>
          Create an account
          </Typography>
      
        </Box>

        {/* Auth Options */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {/* Social Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "8px",
                width: "45%",
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
                width: "45%",
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
          <a href="/auth/signup">
          <Button
  fullWidth
  variant="outlined"
  startIcon={
    <Image
      src="/email1.png" // Make sure to add an email icon to your public folder
      alt="Email"
      width={24}
      height={24}
    />
  }
  sx={{
    py: 1.5,
    link: "/signup",
    borderRadius: "8px",
    border: "2px solid #e4e7e6",
    color: "#000000", // Black color
    fontWeight: "bold", // Bold text
    '&:hover': {
      border: "2px solid #000000", // Black border on hover
    }
  }}
>
  Continue with Email
  
</Button>
</a>

<a href="/signup">
  <Button
    fullWidth
    variant="outlined"
    sx={{
      py: 1.5,
      borderRadius: "8px",
      border: "2px solid #e4e7e6",
      color: "#000000", // Black color
      fontWeight: "bold", // Bold text
      '&:hover': {
        border: "2px solid #000000", // Black border on hover
      }
    }}
  >
    Continue with SSO
  </Button>
</a>
        </Box>

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link href="/auth/signin" style={{ color: "#427662", textDecoration: "none", fontWeight: "bold" }}>
            Log In
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default OnboardingPage;