import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const history = useHistory();
  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData((previusVal) => ({ ...previusVal, [name]: value }));
  };
  const register = async (formData) => {
    if (!validateInput(formData)) return;
    setLoading(true);

    try {
      const data = {
        username: formData.username,
        password: formData.password,
      };
      const sendData = await axios.post(
        `${config.endpoint}/auth/register`,
        data
      );
      setLoading(false);

      if (sendData.status === 201) {
        enqueueSnackbar("Registered Successfully", { variant: "success" });
        history.push("/login");
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable, and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const validateInput = (data) => {
    const { username, password, confirmPassword } = data;
    let minNumber = 6;
    if (!username) {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      return false;
    }
    if (username.length < minNumber) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "error",
      });
      return false;
    }
    if (!password) {
      enqueueSnackbar("Password is a required field", { variant: "error" });
      return false;
    }
    if (password.length < minNumber) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
      return false;
    }
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return false;
    }

    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={1} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={handleFormData}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleFormData}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleFormData}
          />
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              className="button"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
              variant="contained"
              onClick={() => register(formData)}
            >
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
