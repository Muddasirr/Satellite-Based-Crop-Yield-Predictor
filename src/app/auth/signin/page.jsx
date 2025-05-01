'use client'
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Box, Button, Grid, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import StyledTextField from "../../components/StyledTextField";
import useAuthStore from "../../store/useAuthStore";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { login } = useAuthStore(); // 👈 get the login function

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/auth/signin", data);
      console.log("Login successful:", response.data);
      
      // Set user globally
      login(response.data.user); // 👈 set the user in Zustand
  
      router.push("/dashboard/map");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };
  

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
            padding: "2px",
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
              Welcome back to Agro.io
            </Typography>
            <Typography variant="body2" fontWeight={600} color="textSecondary">
              Log in to access your farm and garden dashboard.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <StyledTextField
              fullWidth
              margin="normal"
              label="Email Address"
              variant="outlined"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <StyledTextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              variant="outlined"
              {...register("password", { 
                required: "Password is required", 
                minLength: { 
                  value: 8, 
                  message: "Must be at least 8 characters" 
                } 
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                mt: 2,
                py: 1.5,
                backgroundImage: "linear-gradient(180deg, #A0BAB0 -19.79%, #427662 100%)",
                borderRadius: "10px",
              }}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>

            {/* Social login buttons */}
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

            {/* Don't have an account? Text */}
            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <a href="/auth/signup" style={{ color: "#427662", textDecoration: "none", fontWeight: "bold" }}>
                Sign Up
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;