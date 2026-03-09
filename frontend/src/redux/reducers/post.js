

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    postDialogBox: null,              // boolean, only tell is dialog open or not
    post: null,                       // actual content of post
    postLikesCount: 0,
    postLikedByUser: 0,
    postLikedColor: "grey",
    friendRequestSent: false,
    isPostCreatorFriendAlready: false,
};

const postSlice = createSlice({
    name: "post",
    initialState: initialState,
    reducers: {
        setPostDialogBox: (state, action) => {
            state.postDialogBox = action.payload;
        },
        setPost: (state, action) => {
            state.post = action.payload;
        },
        setPostLikesCount: (state, action) => {
            state.postLikesCount = action.payload;
        },
        setPostLikedByUser: (state, action) => {
            state.postLikedByUser = action.payload;
        },
        setPostLikedColor: (state, action) => {
            state.postLikedColor = action.payload;
        },
        setFriendRequestSent: (state, action) => {
            state.friendRequestSent = action.payload;
        },
        setIsPostCreatorFriendAlready: (state, action) => {
            state.isPostCreatorFriendAlready = action.payload;
        },
        resetPostState: (state) => {
            state.postDialogBox = null;
            state.post = null;
            state.postLikedByUser = 0;
            state.postLikedColor = "grey";
            state.friendRequestSent = false;
            state.isPostCreatorFriendAlready = false;
        },
    },
});

export default postSlice;
export const {
    setPostDialogBox,
    setPost,
    setPostLikesCount,
    setPostLikedByUser,
    setPostLikedColor,
    setFriendRequestSent,
    setIsPostCreatorFriendAlready,
    resetPostState,
} = postSlice.actions;
