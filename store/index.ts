//store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import visitorReducer from "./features/visitorSlice";

const store = configureStore({
  reducer: {
    visitor: visitorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
