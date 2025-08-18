
import React, { useState, useEffect, useMemo } from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import moment from 'moment'
import { fileFormat } from "../../library/functions";
import RenderAttachment from "./RenderAttachment";
import { useSelector } from "react-redux";

const MessageComponent = ({message, user}) => {
    const { attachments, content, sender, receiver, createdAt } = message;

    const sameSender = (sender?._id === user?._id);
    const timeAgo = moment(createdAt).fromNow();

    const { selectedChat } = useSelector((state) => state.chat);


    return (
        <>
            <Stack 
                direction={(sender?._id === user?._id) ? "row" : "row-reverse"}
                sx={{
                    width: "80%",
                    alignItems: "end",
                    alignSelf: (sender?._id === user?._id) ? "flex-start" : "flex-end",
                }}
            >
                { !(sender?._id !== user?._id) && <Avatar src={selectedChat?.avatar?.url} sx={{marginRight: "0.5rem"}} /> }

                <div
                    style={{
                        // backgroundColor: "#F8DE22",
                        // backgroundColor: "#D2DE32",
                        backgroundColor: "#FF7F3E",

                        color: "black",
                        border: "2px solid black",
                        borderRadius: "0.5rem",
                        margin: "0.2rem",
                        padding: "0.5rem",
                        width: "fit-content",
                    }}
                >
                    {/* Text Messages Here */}
                    { content && <Typography> {content} </Typography> }


                    {/* Attachments Here */}
                    {
                        attachments?.length > 0 && (
                            attachments?.map((attachment, index) => {
                                const url = attachment.url;
                                const file = fileFormat(url);

                                return (
                                    <Box key={index} >
                                        {RenderAttachment(file, url)}

                                    </Box>
                                )
                            })
                        )
                    }


                    {/* The Timing of the Message */}
                    <Typography 
                        variant="caption" 
                        color={"text.secondary"}
                        sx={{
                            display: "flex",
                            alignSelf: "flex-end",
                        }}
                    > {timeAgo} </Typography>
                </div>
            </Stack>
        </>
    )
}

export default MessageComponent;