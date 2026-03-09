
import { createSlice } from "@reduxjs/toolkit";
import { NEW_MESSAGE_ALERT, SELECTED_CHAT_ID } from "../../events/events";
import { getOrSaveFromStorage } from "../../library/functions";

const initialState = {
    // selectedChat: getOrSaveFromStorage({key: SELECTED_CHAT_ID, get: true}) || null,
    chatList: {},
    chatListVersion: 0,
    selectedChat: null,
    notificationCount: 0,
    lastMessages: {
        // chatId: { _id(chatId), attachment, content, createdAt, sender, receiver }
    },
    newMessagesAlert: getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, get: true}) || [{
        selectedChat: "",
        count: 0,
    }]
}

const chatSlice = createSlice({
    name: "chat",
    initialState: initialState,
    reducers: {
        setChatList: (state, action) => {
            console.log("CHAT REDUCER: ", state.chatList, action.payload);

            const {chatId, message} = action.payload;
            state.chatList[chatId] = {
                _id: message._id,             // message ID
                attachments: message.attachments,
                content: message.content,
                createdAt: message.createdAt,
                sender: message.sender,
                receiver: message.receiver,
                lastActive: message?.lastActive,
            }

            // const entries = Object.entries(state.chatList);
            // const newEntries = entries.filter(([id]) => id !== chatId);
            // state.chatList = Object.fromEntries([
            //     [chatId, message], // put updated one first
            //     ...newEntries,
            // ]);
    
        },
        setChatListVersion: (state, action) => {
            state.chatListVersion = state.chatListVersion + 1;
        },

        setSelectedChat: (state, action) => {
            console.log('chat reducer: ', action.payload);
            state.selectedChat = action.payload;
            // getOrSaveFromStorage({key: SELECTED_CHAT_ID, value: action.payload});
        },
        
        setLastMessages: (state, action) => {
            const {chatId, message} = action.payload;
            console.log("Chat Redux ", chatId, message);
            
            state.lastMessages[chatId] = {
                _id: message._id,             // message ID
                attachments: message.attachments,
                content: message.content,
                createdAt: message.createdAt,
                sender: message.sender,
                receiver: message.receiver,
                lastActive: message?.lastActive,
            };
            
        }
    },
})

export default chatSlice;
export const {
    setChatList,
    setChatListVersion,
    setSelectedChat,
    setLastMessages,
} = chatSlice.actions;