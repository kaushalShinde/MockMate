

import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import ChatLayout from '../components/layout/ChatLayout';
import SelectFriendAnimation from '../components/styles/SelectFriendAnimation';

const ChatHome = () => {
  return (
    <Stack
        bgcolor="yellow"
        height={"99%"}
        className={"home-background"}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
    >

        <SelectFriendAnimation />

        {/* <Typography
            p={"2rem"}
            variant="h5"
            textAlign={"center"}
        >
            Select A Frient To Chat
        </Typography> */}

    </Stack>
  )
}

export default ChatHome;
