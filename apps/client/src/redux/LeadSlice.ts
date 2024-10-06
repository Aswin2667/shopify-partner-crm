import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  leads: [],
  filtersEanabled: false,
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
    setfiltersEnabled: (state) => {
      state.filtersEanabled = true;
    },
    setfiltersDisabled: (state) => {
      state.filtersEanabled = false;
    },
  },
});

export const leadsAction = Leadslice.actions;

export default Leadslice.reducer;
