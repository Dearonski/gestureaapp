import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface InitialState {
    selectedVideoInput: MediaDeviceInfo;
}

const initialState: InitialState = { selectedVideoInput: null };

export const camSlice = createSlice({
    name: "cam",
    initialState,
    reducers: {
        setVideoInput(state, action: PayloadAction<MediaDeviceInfo>) {
            state.selectedVideoInput = action.payload;
        },
    },
});

export const { setVideoInput } = camSlice.actions;
export const camSelector = (state: RootState) => state.camReducer;
export default camSlice.reducer;
