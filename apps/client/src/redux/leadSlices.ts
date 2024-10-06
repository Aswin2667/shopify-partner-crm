import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mails: [],
  sendAs: [],
  leadContacts: [],
};

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    setMails: (state, action) => {
      state.mails = action.payload;
    },
    setSendAs: (state, action) => {
      state.sendAs = action.payload;
    },

    setLeadContacts: (state, action) => {
      state.leadContacts = action.payload;
    },
  },
});

export const leadAction = leadSlice.actions;

export default leadSlice.reducer;
