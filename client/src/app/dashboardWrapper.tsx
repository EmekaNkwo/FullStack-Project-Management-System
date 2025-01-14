"use client";

import React from "react";
import { SnackbarProvider } from "notistack";
import StoreProvider from "./redux";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;
