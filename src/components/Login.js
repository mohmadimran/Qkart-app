import React, { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { config } from "../App";

const Login = () => {
  const [isLoginData, setLoginData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const history = useHistory();

  // Handle form input changes
  const getLoginData = (e) => {
    setLoginData({ ...isLoginData, [e.target.name]: e.target.value });
  };

  // Validate user input
  const validateInput = (data) => {
    const { username, password } = data;

    if (!username) {
      enqueueSnackbar("Username is a required field", {
        variant: "error",
      });
      return false;
    }
    if (!password) {
      enqueueSnackbar("Password is a required field", {
        variant: "error",
      });
      return false;
    }
    return true;
  };

  // Persist user's login information
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  // Login function
  const login = async ({ username, password }) => {
    if (!validateInput({ username, password })) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${config.endpoint}/auth/login`, {
        username,
        password,
      });
      const { token, username:name, balance } = response.data;
      persistLogin(token, name, balance);
      enqueueSnackbar("Logged in successfully", { variant: "success" });
      history.push("/"); // Redirect to products page
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      enqueueSnackbar(errorMessage, { variant: "error"});
    } finally {
      setIsLoading(false);
    }
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
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>

          <TextField
            id="username-field" // Unique ID for username
            label="Username"
            variant="outlined"
            type="text"
            name="username"
            value={isLoginData.username}
            onChange={getLoginData}
          />
          <TextField
            id="password-field" // Unique ID for password
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={isLoginData.password}
            onChange={getLoginData}
          />
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
              variant="contained"
              onClick={() => login(isLoginData)}
            >
              Login to QKart
            </Button>
          )}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;









