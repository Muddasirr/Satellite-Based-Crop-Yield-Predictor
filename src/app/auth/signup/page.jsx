'use client'
import React from "react";
import { Box, Button, Grid, Typography, Paper } from "@mui/material";
import StyledTextField from "../../components/StyledTextField";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        router.push('/signin');


      } else {
        alert(result.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Side */}
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
            <Box component="img" src="/logo.png" alt="Farm" sx={{ width: "25%", height: "auto" }} />
            <Typography variant="h5" fontWeight={600}>Welcome to Agro.io</Typography>
            <Typography variant="body2" fontWeight={600} color="textSecondary">
              Create an account to access Agro.io and start setting up your farm and garden.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%", margin: "0 auto" }}>
            <StyledTextField
              fullWidth
              margin="normal"
              label="First Name"
              variant="outlined"
              {...register("first_name", { required: "First name is required" })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
            <StyledTextField
              fullWidth
              margin="normal"
              label="Last Name"
              variant="outlined"
              {...register("last_name", { required: "Last name is required" })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
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
              label="Password (8+ Characters)"
              type="password"
              variant="outlined"
              {...register("password", { required: "Password is required", minLength: 8 })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: "12px" }}>
              By continuing, you agree to Fairm’s{" "}
              <a href="#" style={{ color: "#427662", textDecoration: "none", fontWeight: "bold" }}>Terms & Conditions</a> and{" "}
              <a href="#" style={{ color: "#427662", textDecoration: "none", fontWeight: "bold" }}>Privacy Policy</a>
            </Typography>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 2,
                py: 1.5,
                backgroundImage: "linear-gradient(180deg, #A0BAB0 -19.79%, #427662 100%)",
                borderRadius: "10px",
              }}
            >
              Continue
            </Button>

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

              <Typography variant="body2" sx={{ textAlign: "center", fontWeight: "600" }}>OR</Typography>

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

            {/* Already have an account? */}
            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <a href="/auth/signin" style={{ color: "#427662", textDecoration: "none", fontWeight: "bold" }}>
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
