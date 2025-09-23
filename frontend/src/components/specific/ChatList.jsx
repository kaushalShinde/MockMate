

import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChatItem from '../shared/ChatItem';


const ChatList = ({
    w="100%",
    chats,
    newMessagesAlert,
    onlineUsers,
}) => {

    const { selectedChat } = useSelector((state) => state.auth);
    console.log(selectedChat, chats);

  return (
    <>
        <Stack
            width={w}
            height={"100%"}
            overflow={"auto"}
            direction={"column"}
            sx={{
                overflow: "hidden",
                // border: "2px solid black",
                background: 'linear-gradient(180deg, #C5FFF8, #96EFFF, #A0E9FF)',
                
                // background: 'linear-gradient(230deg, #c0fdff, #90dbf4, #fbf8cc)',
                // background: 'linear-gradient(180deg, #edf6f9, #BEADFA)',
                
                // background: 'linear-gradient(180deg, #1E0342, #070F2B)',

                // background: 'linear-gradient(210deg, #EEF5FF, #B4D4FF, #86B6F6, #38419D)',
                // background: 'linear-gradient(180deg, #EEF7FF, #050C9C)', 

            }}
        >
            {
                chats?.map((data, index) => {

                    {/* console.log("ChatList Mapped Item: ", data); */}

                    const {_id, users, lastMessage, createdAt} = data;
                    const newMessageAlert = newMessagesAlert?.find(
                        ({chatId}) => (chatId?.toString() === _id?.toString())
                    );
                    
                    const isOnline = onlineUsers?.includes(_id)
                    console.log(onlineUsers, _id, isOnline)
                    return (
                        <ChatItem 
                            key={_id}
                            _id={_id}
                            chatUser={users[0]}
                            username={users[0]?.username}
                            name={users[0]?.name}
                            avatar={users[0]?.avatar}
                            lastMessage={lastMessage}
                            senderId={data?.lastMessage?.sender}
                            receiverId={data?.lastMessage?.receiver}
                            isOnline={isOnline}
                            createdAt={createdAt}
                        />
                    )
                })
            }
        </Stack>
    </>
  )
}

export default ChatList;