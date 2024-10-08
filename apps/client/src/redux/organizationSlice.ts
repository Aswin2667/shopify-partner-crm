import { createSlice } from "@reduxjs/toolkit";

interface OrganizationState {
  currentOrgMember: any;
  organizations: any[]; // You can replace 'any' with more specific types
  emails: any[];
  unsubscribeLinks: any[];
}

const initialState: OrganizationState = {
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
      console.log(action.payload);
      state.currentOrgMember = action.payload;
    },
    setCurrentOrgMemberSignature: (state, action) => {
      state.currentOrgMember = {
        ...(state.currentOrgMember || {}),
        signature: action.payload,
      };
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
