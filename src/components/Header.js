import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ({ hasHiddenAuthButtons, children }) => {
  const history = useHistory();
  const loginName = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    history.push("/register");
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_dark.svg" alt="QKart-icon" />
        <h2>QKart</h2>
      </Box>
      <Box>{children}</Box>
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
          role="button"
          aria-label="back to explore"
        >
          Back To Explore
        </Button>
      ) : loginName ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={loginName.toLowerCase()} src="avatar.png" />
          <span>{loginName}</span>
          <Button
            variant="text"
            role="button"
            onClick={handleLogout}
            aria-label="logout"
          >
            LOGOUT
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            role="button"
            onClick={() => history.push("/login")}
            aria-label="login"
          >
            LOGIN
          </Button>
          <Button
            variant="text"
            role="button"
            onClick={() => history.push("/register")}
            aria-label="register"
          >
            REGISTER
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
