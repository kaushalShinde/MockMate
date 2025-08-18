
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    sendMeetRequestDialogBox: false,
    meetConfirmationDialogBox: false,
    isMeetRequestAccepted: {
        accepted: false,
    },
    meetRequest: {},
}

const meetSclice = createSlice({
    name: "meet",
    initialState: initialState,
    reducers: {
        setSendMeetRequestDialogBox: (state, action) => {
            state.sendMeetRequestDialogBox = action.payload;
        },
        setMeetConfirmationDialogBox: (state, action) => {
            state.meetConfirmationDialogBox = action.payload;
        },
        setIsMeetRequestAccepted: (state, action) => {
            state.isMeetRequestAccepted.accepted = action.payload;
        },
        setMeetRequest: (state, action) => {
            state.meetRequest = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

    },
})

export default meetSclice;
export const {
    setSendMeetRequestDialogBox, 
    setMeetConfirmationDialogBox,
    setIsMeetRequestAccepted, 
    setMeetRequest,
    setLoading,
} = meetSclice.actions;
