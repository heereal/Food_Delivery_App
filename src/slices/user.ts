import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  // 동기 액션
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: builder => {}, // 비동기 액션
});

export default userSlice;
