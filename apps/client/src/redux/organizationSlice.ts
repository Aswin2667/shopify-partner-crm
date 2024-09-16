import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOrganization: null,
  organizations: [],
  emails: [],
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setCurrentOrganization: (state, action) => {
      state.currentOrganization = action.payload;
    },
    setOrganizations: (state, action) => {
      state.organizations = action.payload;
    },
    setEmails: (state, action) => {
      state.emails = action.payload;
    },
  },
});

export const organizationAction = organizationSlice.actions;

export default organizationSlice.reducer;
