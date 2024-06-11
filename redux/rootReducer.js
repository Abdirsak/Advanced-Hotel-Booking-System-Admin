import apiSlice from "./auth/authApi";
import auth from "./auth/authSlice";
const rootReducer = {
  auth,
  [apiSlice.reducerPath]: apiSlice.reducer,
};

export default rootReducer;
