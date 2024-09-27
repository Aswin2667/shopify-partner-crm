import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mails: [],
  sendAs: [],
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    setMails: (state, action) => {
      state.mails = action.payload;
    },
    setSendAs: (state, action) => {
      state.sendAs = action.payload;
    },
  },
});

export const mailAction = mailSlice.actions;

export default mailSlice.reducer;
