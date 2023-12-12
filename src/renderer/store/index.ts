import { configureStore } from "@reduxjs/toolkit";
import camReducer from "../reducers/camSlice";

export const store = configureStore({
    reducer: {
        camReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
