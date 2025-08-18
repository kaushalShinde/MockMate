

import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import { CallReceivedRounded as CallReceivedRoundedIcon, DoneAllRounded as DoneAllRoundedIcon } from '@mui/icons-material';


import { setSelectedChat } from '../../redux/reducers/chat';
import { setIsChatDrawerOpen } from "../../redux/reducers/misc";

const ChatItem = ({
  chatUser,
  avatar,
  name,
  _id,
  lastMessage,
}) => {
  
  const dispatch = useDispatch();
  
  const { selectedChat } = useSelector((state) => state.auth);
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
            border: "1px solid black",
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
                    border: "2px solid black",
                  }}
                >
                  <Typography color={"black"}> {name} </Typography>
                </Box>

                {/* To show the last message */}
                <Box
                  sx={{
                    marginLeft: "0.5rem",
                    border: "2px solid black",
                  }}
                >
                  {console.log(lastMessage?.sender?.toString(), _id.toString())}
                  {
                    lastMessage?.sender?.toString() === _id.toString() 
                      ? (
                        <Stack direction={"row"} spacing={"0.5rem"} >
                          <DoneAllRoundedIcon />
                          <Typography> {lastMessage?.content}  </Typography>
                        </Stack>
                      ) 
                      : (
                        <Stack direction={"row"} spacing={"0.5rem"}>
                          <CallReceivedRoundedIcon />
                          <Typography> {lastMessage?.content}  </Typography>
                        </Stack>
                      )
                  }
                </Box>


            </Stack>
          </Stack>


        </Box>      
    </>
  )
}

export default ChatItem;
