
import { createSlice } from "@reduxjs/toolkit";
import { NEW_MESSAGE_ALERT, SELECTED_CHAT_ID } from "../../events/events";
import { getOrSaveFromStorage } from "../../library/functions";

const initialState = {
    // selectedChat: getOrSaveFromStorage({key: SELECTED_CHAT_ID, get: true}) || null,
    selectedChat: null,
    notificationCount: 0,
    newMessagesAlert: getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, get: true}) || [{
        selectedChat: "",
        count: 0,
    }]
}

const chatSlice = createSlice({
    name: "chat",
    initialState: initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            console.log('chat reducer: ', action.payload);
            state.selectedChat = action.payload;
            // getOrSaveFromStorage({key: SELECTED_CHAT_ID, value: action.payload});
        },
    },
})

export default chatSlice;
export const {
    setSelectedChat,
} = chatSlice.actions;