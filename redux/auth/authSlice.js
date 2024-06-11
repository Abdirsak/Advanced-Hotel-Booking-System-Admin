import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { getUserData } from "common/utils";

const initialState = {
  userInfo: getUserData(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (state, { payload }) => {
      state.userInfo = payload;
      Cookies.set("rs-account", JSON.stringify(payload), { expires: 1 });
      window.reload = "/";
    },
    logOut: (state, action) => {
      state.userInfo = null;
      Cookies.remove("rs-account");
      window.reload = "/auth/login";
    },
  },
});

export const { setCredential, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state) => state.auth?.userInfo;
