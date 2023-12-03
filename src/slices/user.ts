import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  accessToken: "",
  money: 0,
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
    setMoney(state, action: PayloadAction<number>) {
      state.money = action.payload;
    },
  },
  extraReducers: builder => {}, // 비동기 액션
});

export default userSlice;
