import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentProject: null,
  projects: [],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
    setProjects(state, action) {
      state.projects = action.payload;
    },
  },
});
export const projectAction = projectSlice.actions;
export default projectSlice.reducer;
