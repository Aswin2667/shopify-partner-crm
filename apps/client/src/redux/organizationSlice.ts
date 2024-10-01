import { createSlice } from "@reduxjs/toolkit";
import { unsubscribe } from "diagnostics_channel";

const initialState = {
  currentOrgMember: null,
  organizations: [],
  emails: [],
  unsubscribeLinks: [],
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
    setUnsubscribeLinks: (state, action) => {
      state.unsubscribeLinks = action.payload;
    },
    reset: (state) => {
      // state.organizations = [];
      state.currentOrgMember = null;
      state.emails = [];
      state.unsubscribeLinks = [];
    },
  },
});

export const organizationAction = organizationSlice.actions;

export default organizationSlice.reducer;
