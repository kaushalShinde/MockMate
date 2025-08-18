
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isChatDrawerOpen: false,
    isMobileScreen: false,
    postDialogBox: null,
    isFileMenu: false,
    isUploadingLoader: false,
    refetchPostList: false,
}

const miscSlice = createSlice({
    name: "misc",
    initialState: initialState,
    reducers: {
        setPostDialogBox: (state, action) => {
            state.postDialogBox = action.payload;
        },
        setIsMobileScreen: (state, action) => {
            state.isMobileScreen = action.payload;
        },
        setIsChatDrawerOpen: (state, action) => {
            state.isChatDrawerOpen = action.payload;
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload;
        },
        setIsUploadingLoader: (state, action) => {
            state.isUploadingLoader = action.payload;
        },
        setRefetchPostList: (state, action) => {
            state.refetchPostList = action.payload;
        },
    },
})

export default miscSlice;
export const {
    setPostDialogBox,
    setIsChatDrawerOpen,
    setIsMobileScreen,
    setIsFileMenu,
    setIsUploadingLoader,
    setRefetchPostList,
} = miscSlice.actions;



// import { createSlice } from "@reduxjs/toolkit";

// const initialState={
//     isMobileScreen: false,
//     isChatDrawerOpen: false,
// }

// const miscSlice = createSlice({
//     name: "misc",
//     initialState: initialState,
//     reducers: {
//         setIsMobileScreen: (state, action) => {
//             state.isMobileScreen = action.payload;
//         },
//         setIsChatDrawerOpen: (state, action) => {
//             state.isChatDrawerOpen = action.payload;
//         },
//     },
// });

// export default miscSlice;
// export const {
//     setIsMobileScreen,
//     setIsChatDrawerOpen,
// } = miscSlice.actions;