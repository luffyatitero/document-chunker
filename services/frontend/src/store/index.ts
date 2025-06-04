import { configureStore } from "@reduxjs/toolkit";
import documentsReducer from "./slices/documentsSlice";

const store = configureStore({
  reducer: {
    documents: documentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;