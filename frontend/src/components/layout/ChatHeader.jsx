import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import { Duo as DuoIcon, MoreHoriz as MoreHorizIcon, BlockRounded as BlockRoundedIcon, DeleteOutline as DeleteOutlineIcon, RoomOutlined } from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDateMinutes } from "../../library/functions";
import { setMeetRequest, setSendMeetRequestDialogBox, setMeetConfirmationDialogBox } from "../../redux/reducers/meet";
import { useSocket } from '../../socket';
import { useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ChatHeader = () => {

  const socket = useSocket();
  const naviagte = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { selectedChat } = useSelector((state) => state.chat);
  const { meetRequest, isMeetRequestAccepted } = useSelector((state) => state.meet);

  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [request, setRequest] = useState(null);


  const handleProfileClick = () => {console.log('handleProfileClick')};
  const handleClearChatMessages = () => {console.log('handleClearChatMessages')};
  const handleBlockChat = () => {console.log('handleBlockChat')};



  
  const handleOpenUserChatMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  }

  const handleCloseUserChatMenu = () => {
    setAnchorElUser(null)
  }

  const handleMeetOpen = () => {
    console.log('handleMeetOpen', selectedChat, user);

    const roomId = "123456";
    // const request = {
    //   sender: user,
    //   receiver: selectedChat,
    //   roomId: roomId,
    // }

    const req = {
      sender: user,
      receiver: selectedChat,
      roomId: roomId.toString(),
    };
    setRequest(req)
    console.log(req);

    dispatch(setSendMeetRequestDialogBox(true));
    dispatch(setMeetRequest(req));
  }

  // useEffect(() => {
  //     socket.emit('connect::meet::zego', {request});
  //     socket.on('ZEGO_MEET_ACCEPT', (data) => {
  //         console.log('TESTED_ZEGO', data);
  //     })
  
  // }, [socket, request]);

  useEffect(() => {
    socket.emit('CONNET_ZEGO_MEET', {request});
    socket.on('ACCEPT_ZEGO_MEET', (data) => {
        console.log('TESTED_ZEGO', data?.data?.request);
        if(data?.success) {
          console.log("SUCCESS");
          const req = {
            sender: data?.data?.request?.sender,
            receiver: data?.data?.request?.receiver,
            roomId: data?.data?.request?.roomId,
          }
          dispatch(setMeetRequest(req));
          dispatch(setMeetConfirmationDialogBox(true));
        }
    })

  }, [socket, request]);

  useEffect(() => {
    console.log('TESTING ZEGO_MEET_CONFIRMATION', meetRequest);

    socket.emit('ZEGO_MEET_CONFIRMATION', {request: meetRequest, isMeetRequestAccepted});

    socket.on('ZEGO_MEET_ACCEPTED', () => {
      dispatch(setMeetConfirmationDialogBox(false));
      dispatch(setSendMeetRequestDialogBox(false));

      naviagte('/meet/');
    })
    socket.on('ZEGO_MEET_REJECTED', () => {
      dispatch(setMeetConfirmationDialogBox(false));
      dispatch(setSendMeetRequestDialogBox(false));
    })

  }, [socket, isMeetRequestAccepted]);

  // console.log('isMeetRequestAccepted', isMeetRequestAccepted);

  return (
    <Box
      height={"4rem"}
      sx={{
        display: "flex",
        alignItems: "center",
        border: "2px solid black",

      }}
    >
      <AppBar
        position="static"
        sx={{
          border: "2px solid black",
          // background: 'linear-gradient(160deg, #C80036, #0C1844)',
          background: 'linear-gradient(160deg, #FFFED3, #BBE9FF, #B1AFFF)',
          // background: 'linear-gradient(160deg, #C80036, #2B2E4A)',
        }}
      >
        <Toolbar>
          {/* To show profile pic */}
          <Avatar
            src={selectedChat?.avatar?.url}
            sx={{
              height: "3rem",
              width: "3rem",
              cursor: "pointer",
            }}
            onClick={handleProfileClick}
          />

          {/* To show username and active status */}
          <Stack
            direction={"column"}
            sx={{
              color: "black",
              marginLeft: "1rem",
              border: "2px solid black",
            }}
            onClick={handleProfileClick}
          >
          
            <Typography
              sx={{
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              {" "} {selectedChat?.name} {" "}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.8rem",
              }}
            >
              {selectedChat?.isOnline
                ? "Active now"
                : formatDateMinutes(selectedChat?.lastActive)}
            </Typography>
          </Stack>


          {/* This is for the middle void space */}
          <Box flexGrow={8} sx={{ border: "2px solid black" }} />


          {/* To show the meet button */}
          <DuoIcon
            sx={{
              color: "black",
              height: "2rem",
              width: "2rem",
              marginLeft: "1rem",
              alignSelf: "center",
              cursor: "pointer",
            }}
            onClick={handleMeetOpen}
          />

          {/* To show more options  */}
          <Box flexGrow={1}>
            <IconButton onClick={handleOpenUserChatMenu}>
              <MoreHorizIcon
                sx={{
                  color: "black",
                  height: "2rem",
                  width: "2rem",
                  marginLeft: "1rem",
                  alignSelf: "center",
                  cursor: "pointer",
                }}
              />
            </IconButton>

            <Menu
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserChatMenu}
            >
              <MenuItem>
                <DeleteOutlineIcon />
                <Typography
                  sx={{ marginLeft: "0.5rem" }}
                  onClick={handleClearChatMessages}
                >
                  {" "} Clear Messages {" "}
                </Typography>
              </MenuItem>

              <MenuItem>
                <BlockRoundedIcon />
                <Typography
                  sx={{ marginLeft: "0.5rem" }}
                  onClick={handleBlockChat}
                >
                  {" "} Block {" "}
                </Typography>
              </MenuItem>
            </Menu>

          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ChatHeader;
