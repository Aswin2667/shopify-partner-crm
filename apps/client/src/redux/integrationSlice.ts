import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  integrations: [],
  currentIntegration: null,
  gmail: null,
};

const integrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {
    setIntegrations: (state, action) => {
      state.integrations = action.payload;
    },
    setCurrentIntegration: (state, action) => {
      console.log(action.payload);
      state.currentIntegration = action.payload;
    },
    setGmailIntegration: (state, action) => {
      state.gmail = action.payload;
    },
    reset: (state) => {
      state.currentIntegration = null;
      state.integrations = [];
    },
  },
});

export const integrationAction = integrationSlice.actions;

export default integrationSlice.reducer;
