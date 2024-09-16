import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  presentIntegrations: [],
  integrations: [],
};

const integrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {
    setPresentIntegrations: (state, action) => {
      state.presentIntegrations = action.payload;
    },
    setIntegrations: (state, action) => {
      state.integrations = action.payload;
    },
    reset: (state) => {
      state.currentIntegration = null;
      state.integrations = [];
    },
  },
});

export const integrationAction = integrationSlice.actions;

export default integrationSlice.reducer;
