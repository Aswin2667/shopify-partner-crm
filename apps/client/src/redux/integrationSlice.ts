import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  integrations: [],
};

const integrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {
    setIntegrations: (state, action) => {
      state.integrations = action.payload;
    },
  },
});

export const integrationAction = integrationSlice.actions;

export default integrationSlice.reducer;
