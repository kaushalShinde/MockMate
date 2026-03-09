

import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import { CallReceivedRounded as CallReceivedRoundedIcon, DoneAllRounded as DoneAllRoundedIcon } from '@mui/icons-material';


import { setSelectedChat } from '../../redux/reducers/chat';
import { setIsChatDrawerOpen } from "../../redux/reducers/misc";

import { formatDate, formatChatTime } from "../../library/functions";
import { useEffect } from 'react';

const ChatItem = ({
  chatUser,
  avatar,
  name,
  _id,
  isOnline,
  lastActive,
  // lastMessage,
  senderId,
  receiverId,
  createdAt,
}) => {

  const chatId = _id;
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { selectedChat } = useSelector((state) => state.chat);
  const lastMessage = useSelector((state) => state.chat.lastMessages[chatUser?._id]);
  // const lastMessage = useSelector((state) => state.chat.chatList[chatUser?._id]);

  // const lastMessage = lastMessages[chatUser?._id];

  // const { isMobileScreen } = useSelector((state) => state.misc);
  // const { isChatDrawerOpen } = useSelector((state) => state.misc);
  
  console.log("#############  ", {chatUser, selectedChat, lastMessage, _id});
  console.log(`@@@ ${lastMessage?.content}`);
  // console.log(`SenderId: ${senderId} ReceiverId: ${receiverId} chatUser: ${JSON.stringify(chatUser)} lastMessage: ${JSON.stringify(lastMessage)}  `)

  const handleChatItemClick = () => {
    console.log('handleChatItemClick');
    dispatch(setSelectedChat({ ...chatUser, lastActive }));
    // if(isMobileScreen){
    //   dispatch(setIsChatDrawerOpen(!isChatDrawerOpen));
    // }
  }
  
  // useEffect(() => {
  //   if (!lastMessage) return;
  
  //   console.log("ChatItem lastMessage updated:", lastMessage);
  //   // todo update
  
  // }, [lastMessage]);

  useEffect(() => {
    console.log("LAST_MESSAGE", lastMessage);
  }, [lastMessage]);

  return (
    <>
        <Box
          sx={{
            height: "5rem",
            width: "100%",
            color: "black",
            border: "1px solid #ccc",
            // borderRadius: "5px",
            // bgcolor: (selectedChat?._id == _id) ? "#E0F9B5" : "transparent",    // A6F6FF  B1B2FF
          }}
          className={selectedChat?._id === _id ? "chat-item selected" : "chat-item"}
          onClick={handleChatItemClick}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
          >

            {/* To show profile photo */}
            <Box 
              sx={{
                margin: "0.5rem",
                alignItems: "center",
              }}
            >
              <Avatar 
                src={avatar?.url} 
                sx={{
                  height: "3.5rem",
                  width: "3.5rem",
                  border: "1px solid #9e9e9e",
                }}  
              />
            </Box>



            {/* The middle part of chat item to show name and last meesage */}
            <Stack 
              direction={"column"}
              sx={{
                width: "60%",
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >

                {/* To show the name of user */}
                <Box
                  sx={{
                    marginLeft: "0.5rem",
                    // border: "2px solid black",
                  }}
                >
                  <Typography color={"black"}> {name} </Typography>
                </Box>

                {/* To show the last message */}
                <Box
                  sx={{
                    marginLeft: "0.5rem",
                    // border: "2px solid black",
                  }}
                >
                
                  {/* {
                    (!senderId || !receiverId) ? (
                      <Typography fontSize="14px" color="text.secondary"> No messages yet — say hi 👋 </Typography>
                    ) : (
                      (senderId?.toString() === user?._id?.toString()) ? (
                        <Stack direction="row" spacing="0.5rem" alignItems="center">
                          <DoneAllRoundedIcon fontSize="small" color="primary" />
                          <Typography fontSize="14px"> {lastMessage?.content} </Typography>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing="0.5rem" alignItems="center">
                          <CallReceivedRoundedIcon fontSize="small" color="success" />
                          <Typography fontSize="14px"> {lastMessage?.content} </Typography>
                        </Stack>
                      )
                    )
                  } */}


                      {/* (lastMessage?.sender?._id?.toString() === user?._id?.toString()) ? ( */}
                    
                  {
                    (!lastMessage?.sender?._id?.toString() || !user?._id?.toString()) ? (
                      <Typography fontSize="14px" color="text.secondary"> No messages yet — say hi 👋 </Typography>
                    ) : (
                      (lastMessage?.sender?._id?.toString() === user?._id?.toString()) ? (
                        <Stack direction="row" spacing="0.5rem" alignItems="center">
                          <DoneAllRoundedIcon fontSize="small" color="primary" />
                          {(lastMessage?.content) 
                            ? <Typography fontSize="14px"> {lastMessage?.content} </Typography>
                            : <Typography fontSize="14px"> File </Typography>
                          }
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing="0.5rem" alignItems="center">
                          <CallReceivedRoundedIcon fontSize="small" color="success" />
                          {(lastMessage?.content) 
                            ? <Typography fontSize="14px"> {lastMessage?.content} </Typography>
                            : <Typography fontSize="14px"> File </Typography>
                          }
                        </Stack>
                      )
                    )
                  }
                </Box>
            </Stack>

                {/* Todo: add the timestamp fro the last message */}
                <Typography sx={{ fontSize: "0.9rem" }}> { formatChatTime(lastMessage?.createdAt) } </Typography>


          </Stack>


        </Box>      
    </>
  )
}

export default ChatItem;
