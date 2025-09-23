

import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import { CallReceivedRounded as CallReceivedRoundedIcon, DoneAllRounded as DoneAllRoundedIcon } from '@mui/icons-material';


import { setSelectedChat } from '../../redux/reducers/chat';
import { setIsChatDrawerOpen } from "../../redux/reducers/misc";

import { formatDate, formatChatTime } from "../../library/functions";

const ChatItem = ({
  chatUser,
  avatar,
  name,
  _id,
  lastMessage,
  senderId,
  receiverId,
  createdAt,
}) => {
  
  const dispatch = useDispatch();
  
  const { user, selectedChat } = useSelector((state) => state.auth);
  const { isMobileScreen } = useSelector((state) => state.misc);
  const { isChatDrawerOpen } = useSelector((state) => state.misc);
  
  console.log(chatUser, selectedChat, _id);

  const handleChatItemClick = () => {
    console.log('handleChatItemClick');
    dispatch(setSelectedChat(chatUser));
    if(isMobileScreen){
      dispatch(setIsChatDrawerOpen(!isChatDrawerOpen));
    }
  }

  return (
    <>
        <Box
          sx={{
            height: "5rem",
            width: "100%",
            color: "black",
            border: "1px solid #ccc",
            // borderRadius: "5px",
            // bgcolor: selectedChat?._id == _id && "#D2DE32",
          }}
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
                
                  {
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
