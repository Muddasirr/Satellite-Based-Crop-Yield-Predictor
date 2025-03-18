"use client";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Box, Button, Grid, TextField, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/auth/signin", data);
      console.log("Login successful:", response.data);
       router.push('/map');
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

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
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", px: { xs: 4, md: 16 } }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Box component="img" src="/logo.png" alt="Farm" sx={{ width: "30%", height: "auto" }} />
            <Typography variant="h5" fontWeight={600}>
              Welcome to Agro.io
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              variant="outlined"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password (8+ Characters)"
              type="password"
              variant="outlined"
              {...register("password", { required: "Password is required", minLength: { value: 8, message: "Must be at least 8 characters" } })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                mt: 1,
                py: 1.5,
                backgroundImage: "linear-gradient(180deg, #A0BAB0 -19.79%, #427662 100%)",
              }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
