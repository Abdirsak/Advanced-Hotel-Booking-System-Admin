import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./auth/authApi";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware);
  },
});

export { store };
