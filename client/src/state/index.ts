import { User } from "@/shared/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  accessToken: string | null;
  currentUser: User | null;
  userID: number | null;
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  accessToken: null,
  currentUser: null,
  userID: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setUserID: (state, action: PayloadAction<number | null>) => {
      state.userID = action.payload;
    },
  },
});

export const {
  setIsSidebarCollapsed,
  setIsDarkMode,
  setAccessToken,
  setCurrentUser,
  setUserID,
} = globalSlice.actions;
export default globalSlice.reducer;
