
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reducers/auth';
import chatSlice from './reducers/chat';
import meetSclice from './reducers/meet';
import miscSlice from './reducers/misc';
import postSlice from './reducers/post';

const store = configureStore({
    reducer: {
        [authSlice.name] : authSlice.reducer,
        [chatSlice.name]: chatSlice.reducer,
        [miscSlice.name]: miscSlice.reducer,
        [meetSclice.name]: meetSclice.reducer,
        [postSlice.name]: postSlice.reducer,
    }
});

export default store;