import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    recentChannelId: null,
    recentChannelName: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setRecentChannelInfo: (state, action) => {
      state.recentChannelId = action.payload.channelId;
      state.recentChannelName = action.payload.channelName;
    }
  },
});

export const { login, logout, setRecentChannelInfo } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectRecentChannelId = (state) => state.user.recentChannelId;
export const selectRecentChannelName = (state) => state.user.recentChannelName;

export default userSlice.reducer;