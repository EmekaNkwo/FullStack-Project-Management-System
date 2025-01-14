"use client";
import React, { useEffect } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import CustomTabPanel from "../Tabs";
import Login from "./Login";
import SignUp from "./SignUp";
import { storageFactory } from "@/lib/utils";

const AuthComponent = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    storageFactory().clearStorage();
  }, []);

  return (
    <Box className="absolute left-1/2 top-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="auth tabs"
        >
          <Tab label="Login" {...a11yProps(0)} />
          <Tab label="Create an Account" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Login />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SignUp />
      </CustomTabPanel>
    </Box>
  );
};

export default AuthComponent;
