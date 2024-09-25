import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  leads: [],
};

const Leadslice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setLeads: (state, action) => {
      state.Leads = action.payload;
    },
    reset: (state) => {
      state.Leads = [];
    },
  },
});

export const leadsAction = Leadslice.actions;

export default Leadslice.reducer;