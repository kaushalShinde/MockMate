

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";


const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1`,
    }),
    tagTypes: ["Chat", "User", "Message"],

    endpoints: (builder) => ({

        myChats: builder.query({
            query: () => ({
                url: "/chat/my",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),

        getMessages: builder.query({
            query: ({ chatId, page = 1 }) => ({
                url: `/chat/messages/${chatId}?page=${page}`,
                credentials: "include",
            }),
            keepUnusedDataFor: 0,
        })
    })
});


export default api;
export const {
    useMyChatsQuery,
    useGetMessagesQuery,
} = api;

