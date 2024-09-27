import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOrgMember: null,
  organizations: [],
  emails: [],
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setCurrentOrgMember: (state, action) => {
      state.currentOrgMember = action.payload;
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
