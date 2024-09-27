import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  leads: [],
  filtersEanabled:{}
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
    setfiltersEnabled: (state, action) => {
      state.filtersEanabled = action.payload;
    },  
  },
});

export const leadsAction = Leadslice.actions;

export default Leadslice.reducer;